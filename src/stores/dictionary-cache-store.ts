import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TDictionaryCacheItem = {
	id: number
	word: string
	meaning: string
}

export type TDictionaryPageCache = {
	page: number
	totalItems: number
	items: TDictionaryCacheItem[]
}

type TDictionaryCacheState = {
	hydrated: boolean
	cache: Record<string, TDictionaryPageCache | undefined>
	setHydrated: (value: boolean) => void
	setPageCache: (dbId: string, data: TDictionaryPageCache) => void
	getPageCache: (dbId: string) => TDictionaryPageCache | null
	clearPageCache: (dbId: string) => void
}

export const useDictionaryCacheStore = create<TDictionaryCacheState>()(
	persist(
		(set, get) => ({
			hydrated: false,
			cache: {},
			setHydrated: (value) => set({ hydrated: value }),
			setPageCache: (dbId, data) =>
				set((state) => ({
					cache: { ...state.cache, [dbId]: data }
				})),
			getPageCache: (dbId) => get().cache[dbId] ?? null,
			clearPageCache: (dbId) =>
				set((state) => {
					const next = { ...state.cache }
					delete next[dbId]
					return { cache: next }
				})
		}),
		{
			name: 'dictionary-page-cache',
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true)
			}
		}
	)
)

const STORAGE_KEY = 'dictionary-page-cache'

export const setDictionaryPageCache = (
	dbId: string,
	data: TDictionaryPageCache
) => useDictionaryCacheStore.getState().setPageCache(dbId, data)

export const getDictionaryPageCache = (dbId: string) =>
	useDictionaryCacheStore.getState().getPageCache(dbId)

export const getDictionaryPageCacheFromLocalStorage = (
	dbId: string
): TDictionaryPageCache | null => {
	if (typeof window === 'undefined') return null
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as unknown
		if (typeof parsed !== 'object' || !parsed) return null
		if (!('state' in parsed)) return null
		const state = (parsed as { state?: unknown }).state
		if (typeof state !== 'object' || !state) return null
		if (!('cache' in state)) return null
		const cache = (state as { cache?: unknown }).cache
		if (typeof cache !== 'object' || !cache) return null
		return (
			(cache as Record<string, TDictionaryPageCache | undefined>)[dbId] ?? null
		)
	} catch {
		return null
	}
}

export const clearDictionaryPageCache = (dbId: string) =>
	useDictionaryCacheStore.getState().clearPageCache(dbId)
