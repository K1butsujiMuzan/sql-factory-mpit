'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import DictionaryPagination from '@/components/Dictionary/DictionaryPagination'
import { PlusIcon } from '@/components/Dictionary/DictionaryIcons'
import DictionaryRowActions from '@/components/Dictionary/DictionaryRowActions'
import Input from '@/components/Input/Input'

type DictionaryItem = {
	id: string
	word: string
	value: string
}

const PAGE_SIZE = 6

const seed: DictionaryItem[] = Array.from({ length: 60 }, (_, i) => {
	const idx = i + 1
	const word =
		idx % 5 === 0
			? 'INDEX'
			: idx % 4 === 0
				? 'JOIN'
				: idx % 3 === 0
					? 'SELECT'
					: 'SQL'
	const value =
		idx % 6 === 0
			? 'Если представить базу данных как огромную цифровую картотеку или набор связанных таблиц, то SQL — это способ «поговорить» с ней: попросить найти нужный документ, добавить новую запись или удалить старую.'
			: idx % 5 === 0
				? 'Структура данных для ускорения поиска строк (ценой места и скорости записи).'
				: idx % 4 === 0
					? 'Оператор, который соединяет строки из двух или более таблиц по условию.'
					: 'Если представить базу данных как огромную цифровую картотеку или набор связанных таблиц.'

	return {
		id: `seed-${idx}`,
		word,
		value
	}
})

const DictionaryView = () => {
	const [items, setItems] = useState<DictionaryItem[]>(seed)
	const [page, setPage] = useState(1)

	const [word, setWord] = useState('')
	const [value, setValue] = useState('')

	const [editingId, setEditingId] = useState<string | null>(null)
	const [draftWord, setDraftWord] = useState('')
	const [draftValue, setDraftValue] = useState('')

	const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

	const pageItems = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE
		return items.slice(start, start + PAGE_SIZE)
	}, [items, page])

	const canAdd = word.trim().length > 0 && value.trim().length > 0

	const onAdd = () => {
		if (!canAdd) return
		const newItem: DictionaryItem = {
			id: crypto.randomUUID(),
			word: word.trim(),
			value: value.trim()
		}
		setItems((prev) => [newItem, ...prev])
		setWord('')
		setValue('')
		setPage(1)
	}

	const onDelete = (id: string) => {
		setItems((prev) => prev.filter((x) => x.id !== id))
	}

	const onStartEdit = (item: DictionaryItem) => {
		setEditingId(item.id)
		setDraftWord(item.word)
		setDraftValue(item.value)
	}

	const onSaveEdit = () => {
		if (!editingId) return
		const nextWord = draftWord.trim()
		const nextValue = draftValue.trim()
		if (!nextWord || !nextValue) return

		setItems((prev) =>
			prev.map((x) =>
				x.id === editingId ? { ...x, word: nextWord, value: nextValue } : x
			)
		)
		setEditingId(null)
	}

	const onCancelEdit = () => {
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
						disabled={!canAdd}
						className={cn(
							'h-[30px] w-full rounded-[10px] flex items-center justify-center transition bg-accent',
							canAdd ? 'hover:opacity-90' : 'cursor-not-allowed'
						)}
						aria-label="Добавить"
					>
						<PlusIcon />
					</button>
				</div>

				<ul className="mt-5 flex flex-col gap-3">
					{pageItems.map((item) => {
						const isEditing = editingId === item.id
						return (
							<li
								key={item.id}
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
					onPageChange={setPage}
				/>
			</div>
		</section>
	)
}

export default DictionaryView
