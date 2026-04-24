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
	cache: Record<string, TDictionaryPageCache | undefined>
	setPageCache: (dbId: string, data: TDictionaryPageCache) => void
	getPageCache: (dbId: string) => TDictionaryPageCache | null
	clearPageCache: (dbId: string) => void
}

export const useDictionaryCacheStore = create<TDictionaryCacheState>()(
	persist(
		(set, get) => ({
			cache: {},
			setPageCache: (dbId, data) =>
				set((state) => ({
					cache: { ...state.cache, [dbId]: data }
				})),
			getPageCache: (dbId) => get().cache[dbId] ?? null,
			clearPageCache: (dbId) =>
				set((state) => {
					const { [dbId]: _removed, ...rest } = state.cache
					return { cache: rest }
				})
		}),
		{ name: 'dictionary-page-cache' }
	)
)

export const setDictionaryPageCache = (dbId: string, data: TDictionaryPageCache) =>
	useDictionaryCacheStore.getState().setPageCache(dbId, data)

export const getDictionaryPageCache = (dbId: string) =>
	useDictionaryCacheStore.getState().getPageCache(dbId)

export const clearDictionaryPageCache = (dbId: string) =>
	useDictionaryCacheStore.getState().clearPageCache(dbId)

