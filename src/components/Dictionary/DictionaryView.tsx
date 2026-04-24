'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import DictionaryPagination from '@/components/Dictionary/DictionaryPagination'
import { PlusIcon } from '@/components/Dictionary/DictionaryIcons'
import DictionaryRowActions from '@/components/Dictionary/DictionaryRowActions'
import Input from '@/components/Input/Input'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import { addDictItem, deleteDictItem, getDict, updateDictItem } from '@/services/dict'
import {
	clearDictionaryPageCache,
	setDictionaryPageCache,
	useDictionaryCacheStore,
	type TDictionaryPageCache
} from '@/stores/dictionary-cache-store'

type DictionaryItem = {
	id: number
	key: string
	word: string
	value: string
}

const PAGE_SIZE = 6

interface Props {
	dbId: string
}

function toDictionaryItems(data: unknown): DictionaryItem[] {
	if (!data) return []

	if (Array.isArray(data)) {
		return data
			.map((x) => {
				if (typeof x !== 'object' || !x) return null
				const item = x as Partial<{ id: unknown; word: unknown; meaning: unknown }>
				const id = typeof item.id === 'number' ? item.id : Number(item.id)
				const word = typeof item.word === 'string' ? item.word : ''
				const meaning = typeof item.meaning === 'string' ? item.meaning : ''
				if (!Number.isFinite(id) || !word || !meaning) return null
				return { id, key: String(id), word, value: meaning } satisfies DictionaryItem
			})
			.filter(Boolean) as DictionaryItem[]
	}

	return []
}

const DictionaryView = ({ dbId }: Props) => {
	const queryClient = useQueryClient()

	const cached: TDictionaryPageCache | null = useDictionaryCacheStore(
		(state) => state.cache[dbId] ?? null
	)

	const [page, setPage] = useState(() => cached?.page ?? 1)
	const isFetchEnabled = !cached || cached.page !== page

	const dictQuery = useQuery<unknown, Error, DictionaryItem[]>({
		queryKey: [QUERY_KEYS.DICTIONARY, dbId],
		queryFn: async () => (await getDict(dbId)) as unknown,
		select: (data) => toDictionaryItems(data),
		placeholderData: [],
		enabled: isFetchEnabled,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	useEffect(() => {
		if (!dictQuery.data) return

		const data = dictQuery.data
		const totalItems = data.length
		const start = (page - 1) * PAGE_SIZE
		const pageItems = data.slice(start, start + PAGE_SIZE)
		const nextCache: TDictionaryPageCache = {
			page,
			totalItems,
			items: pageItems.map((item) => ({
				id: item.id,
				word: item.word,
				meaning: item.value
			}))
		}
		setDictionaryPageCache(dbId, nextCache)
	}, [dbId, dictQuery.data, page])

	const [word, setWord] = useState('')
	const [value, setValue] = useState('')

	const [error, setError] = useState('')

	const [editingKey, setEditingKey] = useState<string | null>(null)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [draftWord, setDraftWord] = useState('')
	const [draftValue, setDraftValue] = useState('')

	const isUsingCache = !dictQuery.data && !!cached && cached.page === page
	const cachedPageItems = useMemo(
		() =>
			cached?.items.map(({ id, word, meaning }) => ({
				id,
				key: String(id),
				word,
				value: meaning
			})) ?? [],
		[cached]
	)

	const items = useMemo(() => dictQuery.data ?? [], [dictQuery.data])
	const totalItems = dictQuery.data ? dictQuery.data.length : cached?.totalItems ?? 0
	const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

	const pageItems = useMemo(() => {
		if (isUsingCache) return cachedPageItems
		const start = (page - 1) * PAGE_SIZE
		return items.slice(start, start + PAGE_SIZE)
	}, [cachedPageItems, isUsingCache, items, page])

	const canAdd = word.trim().length > 0 && value.trim().length > 0

	const onAdd = async () => {
		setError('')
		if (!canAdd) return
		try {
			const res = await addDictItem({
				db: dbId,
				word: word.trim(),
				meaning: value.trim()
			})

			if ('error' in res) {
				return setError(res.error)
			}

			clearDictionaryPageCache(dbId)
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DICTIONARY, dbId] })
			setWord('')
			setValue('')
			setPage(1)
		} catch (e) {
			console.error(e)
			setError('ошибка сохранения')
		}
	}

	const onDelete = async (id: number) => {
		setError('')
		try {
			const res = await deleteDictItem(id)
			if (res?.error) {
				return setError(res.error)
			}
			clearDictionaryPageCache(dbId)
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DICTIONARY, dbId] })
		} catch (e) {
			console.error(e)
			setError('ошибка удаления')
		}
	}

	const onStartEdit = (item: DictionaryItem) => {
		setError('')
		setEditingKey(item.key)
		setEditingId(item.id)
		setDraftWord(item.word)
		setDraftValue(item.value)
	}

	const onSaveEdit = async () => {
		setError('')
		if (!editingKey) return
		const nextWord = draftWord.trim()
		const nextValue = draftValue.trim()
		if (!nextWord || !nextValue) return
		if (!editingId) return

		try {
			const res = await updateDictItem({
				id: editingId,
				db: dbId,
				word: nextWord,
				meaning: nextValue
			})
			if (res?.error) {
				return setError(res.error)
			}
			clearDictionaryPageCache(dbId)
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DICTIONARY, dbId] })
			setEditingKey(null)
			setEditingId(null)
		} catch (e) {
			console.error(e)
			setError('ошибка сохранения')
		}
	}

	const onCancelEdit = () => {
		setError('')
		setEditingKey(null)
		setEditingId(null)
	}

	return (
		<section className="w-full h-full p-5 flex flex-col">
			<div className="w-full max-w-[1100px] mx-auto flex flex-col flex-1">
				<div className="grid grid-cols-[220px_1fr_20px_76px] items-center text-base font-normal text-dark-menu">
					<div className="text-center">Слово</div>
					<div className="text-center">Значение</div>
					<div />
					<div />
				</div>

				<div className="mt-5 grid grid-cols-[220px_1fr_76px] gap-5 items-center">
					<div className="col-span-2 w-full h-12 rounded-[10px] border border-gray-main overflow-hidden flex items-stretch">
						<div className="w-[220px] px-3 flex items-center">
							<Input
								value={word}
								onChange={(e) => setWord(e.target.value)}
								label="Введите слово"
								inputId="dictionary-word"
								type="text"
							/>
						</div>
						<div className="w-px bg-gray-main" aria-hidden={true} />
						<div className="flex-1 px-3 flex items-center">
							<Input
								value={value}
								onChange={(e) => setValue(e.target.value)}
								label="Введите его значение"
								inputId="dictionary-value"
								type="text"
							/>
						</div>
					</div>

					<button
						type="button"
						onClick={onAdd}
						disabled={!canAdd || dictQuery.isFetching}
						className={cn(
							'h-[30px] w-full rounded-[10px] flex items-center justify-center transition bg-accent',
							canAdd && !dictQuery.isFetching
								? 'hover:opacity-90'
								: 'cursor-not-allowed'
						)}
						aria-label="Добавить"
					>
						<PlusIcon />
					</button>
				</div>

				{error.length > 0 && <ErrorMessage message={error} className="mt-2 p-0" />}
				{dictQuery.isError && (
					<ErrorMessage
						message={dictQuery.error?.message ?? 'ошибка загрузки'}
						className="mt-2 p-0"
					/>
				)}

				<ul className="mt-5 flex flex-col gap-3">
					{pageItems.map((item) => {
						const isEditing = editingKey === item.key
						return (
							<li
								key={item.key}
								className="grid grid-cols-[220px_1fr_20px_76px] items-stretch gap-0"
							>
								<div className="col-span-2 bg-gray-100 rounded-[10px] overflow-hidden flex items-stretch min-h-[72px]">
									<div className="w-[220px] px-5 py-4">
										{isEditing ? (
											<input
												value={draftWord}
												onChange={(e) => setDraftWord(e.target.value)}
												className="w-full bg-transparent outline-none text-sm text-dark-menu leading-6"
											/>
										) : (
											<span className="text-sm text-dark-menu">
												{item.word}
											</span>
										)}
									</div>
									<div className="w-px bg-gray-main" aria-hidden={true} />
									<div className="flex-1 px-5 py-4">
										{isEditing ? (
											<textarea
												value={draftValue}
												onChange={(e) => setDraftValue(e.target.value)}
												rows={3}
												className="w-full bg-transparent outline-none text-sm text-dark-menu leading-6 resize-none"
											/>
										) : (
											<p className="text-sm text-dark-menu leading-6">
												{item.value}
											</p>
										)}
									</div>
								</div>

								<div aria-hidden={true} />

								<div className="py-4 flex items-center justify-center">
									{isEditing ? (
										<>
											<button
												type="button"
												onClick={onSaveEdit}
												className="w-9 h-9 rounded-full hover:bg-white/70 transition flex items-center justify-center text-dark-menu"
												aria-label="Сохранить"
											>
												<span className="text-2xl leading-none">✓</span>
											</button>
											<button
												type="button"
												onClick={onCancelEdit}
												className="w-9 h-9 rounded-full hover:bg-white/70 transition flex items-center justify-center text-gray-main"
												aria-label="Отменить"
											>
												<span className="text-2xl leading-none">×</span>
											</button>
										</>
									) : (
										<DictionaryRowActions
											onEdit={() => onStartEdit(item)}
											onDelete={() => onDelete(item.id)}
										/>
									)}
								</div>
							</li>
						)
					})}
				</ul>

				<DictionaryPagination
					className="mt-auto pt-6"
					page={page}
					totalPages={totalPages}
					onPageChange={(nextPage) => {
						setPage(nextPage)
					}}
				/>
			</div>
		</section>
	)
}

export default DictionaryView
