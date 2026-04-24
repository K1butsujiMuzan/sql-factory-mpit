'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import DictionaryPagination from '@/components/Dictionary/DictionaryPagination'
import { PlusIcon } from '@/components/Dictionary/DictionaryIcons'
import DictionaryRowActions from '@/components/Dictionary/DictionaryRowActions'
import Input from '@/components/Input/Input'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import {
	addDictItem,
	deleteDictItem,
	getDict,
	updateDictItem
} from '@/services/dict'

type DictionaryItem = {
	id: number | null
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

	if (typeof data === 'object' && data) {
		const obj = data as Record<string, unknown>
		if (Array.isArray(obj.items)) return toDictionaryItems(obj.items)
		if (Array.isArray(obj.data)) return toDictionaryItems(obj.data)
	}

	if (Array.isArray(data)) {
		return data
			.map((x) => {
				if (typeof x !== 'object' || !x) return null
				const item = x as Partial<{
					id: unknown
					word: unknown
					meaning: unknown
				}>
				const id = typeof item.id === 'number' ? item.id : Number(item.id)
				const word = typeof item.word === 'string' ? item.word : ''
				const meaning = typeof item.meaning === 'string' ? item.meaning : ''
				if (!Number.isFinite(id) || !word || !meaning) return null
				return {
					id,
					key: String(id),
					word,
					value: meaning
				} satisfies DictionaryItem
			})
			.filter(Boolean) as DictionaryItem[]
	}

	if (typeof data === 'object') {
		return Object.entries(data as Record<string, unknown>)
			.map(([word, meaning]) => {
				if (typeof meaning !== 'string') return null
				return {
					id: null,
					key: word,
					word,
					value: meaning
				} satisfies DictionaryItem
			})
			.filter(Boolean) as DictionaryItem[]
	}

	return []
}

const DictionaryView = ({ dbId }: Props) => {
	const queryClient = useQueryClient()

	const [page, setPage] = useState(1)

	const dictQuery = useQuery<unknown, Error, DictionaryItem[]>({
		queryKey: [QUERY_KEYS.DICTIONARY, dbId],
		queryFn: async () => (await getDict(dbId)) as unknown,
		select: (data) => toDictionaryItems(data),
		placeholderData: [],
		enabled: true,
		staleTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: false
	})

	const [word, setWord] = useState('')
	const [value, setValue] = useState('')

	const [error, setError] = useState('')

	const [editingKey, setEditingKey] = useState<string | null>(null)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [draftWord, setDraftWord] = useState('')
	const [draftValue, setDraftValue] = useState('')

	const items = useMemo(() => dictQuery.data ?? [], [dictQuery.data])
	const totalItems = items.length
	const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

	const pageItems = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE
		return items.slice(start, start + PAGE_SIZE)
	}, [items, page])

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

			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DICTIONARY, dbId]
			})
			setWord('')
			setValue('')
			setPage(1)
		} catch (e) {
			console.error(e)
			setError('ошибка сохранения')
		}
	}

	const onDelete = async (id: number | null) => {
		setError('')
		if (!id) return setError('не удалось удалить: нет id элемента')
		try {
			const res = await deleteDictItem(id)
			if (res?.error) {
				return setError(res.error)
			}
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DICTIONARY, dbId]
			})
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
		if (!editingId) return setError('не удалось сохранить: нет id элемента')

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
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DICTIONARY, dbId]
			})
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

				{error.length > 0 && (
					<ErrorMessage message={error} className="mt-2 p-0" />
				)}
				{dictQuery.isError && (
					<ErrorMessage
						message={dictQuery.error?.message ?? 'ошибка загрузки'}
						className="mt-2 p-0"
					/>
				)}
				{dictQuery.isFetching && (
					<div className="mt-2 text-xs text-gray-main">Загрузка...</div>
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
