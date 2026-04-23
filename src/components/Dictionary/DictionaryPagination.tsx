import { cn } from '@/lib/cn'
import { useId, useState } from 'react'

interface Props {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
	className?: string
}

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value))

const getPages = (page: number, totalPages: number): (number | '…')[] => {
	if (totalPages <= 6) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	// Matches the Figma behavior: show 1 2 3 4 … N near start,
	// … (N-3) (N-2) (N-1) N near end, and a compact window in the middle.
	if (page <= 4) {
		return [1, 2, 3, 4, '…', totalPages]
	}

	if (page >= totalPages - 3) {
		return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
	}

	return [1, '…', page - 1, page, page + 1, '…', totalPages]
}

const DictionaryPagination = ({
	page,
	totalPages,
	onPageChange,
	className
}: Props) => {
	const inputId = useId()
	const [isJumpOpen, setIsJumpOpen] = useState(false)
	const [jumpValue, setJumpValue] = useState('')

	if (totalPages <= 1) return null

	const safePage = clamp(page, 1, totalPages)
	const pages = getPages(safePage, totalPages)

	const commitJump = () => {
		const raw = jumpValue.trim()
		const num = Number(raw)
		if (!Number.isFinite(num)) {
			setIsJumpOpen(false)
			setJumpValue('')
			return
		}
		onPageChange(clamp(Math.trunc(num), 1, totalPages))
		setIsJumpOpen(false)
		setJumpValue('')
	}

	return (
		<nav
			aria-label="Pagination"
			className={cn('flex items-center justify-center gap-3', className)}
		>
			<button
				type="button"
				className="w-7 h-7 flex items-center justify-center text-gray-main disabled:opacity-40 select-none"
				onClick={() => onPageChange(clamp(safePage - 1, 1, totalPages))}
				disabled={safePage === 1}
				aria-label="Previous page"
			>
				<span className="text-lg leading-none select-none">‹</span>
			</button>

			<div className="flex items-center gap-2">
				{pages.map((p, idx) =>
					p === '…' ? (
						isJumpOpen ? (
							<label
								key={`dots-${idx}`}
								className="w-7 h-7 rounded-[6px] text-sm border border-gray-light bg-white text-gray-main flex items-center justify-center"
								htmlFor={inputId}
							>
								<span className="sr-only">Перейти на страницу</span>
								<input
									id={inputId}
									inputMode="numeric"
									pattern="[0-9]*"
									autoFocus
									value={jumpValue}
									onChange={(e) =>
										setJumpValue(e.target.value.replace(/[^\d]/g, ''))
									}
									onBlur={commitJump}
									onKeyDown={(e) => {
										if (e.key === 'Enter') commitJump()
										if (e.key === 'Escape') {
											setIsJumpOpen(false)
											setJumpValue('')
										}
									}}
									className="w-full h-full text-center bg-transparent outline-none text-sm text-dark-menu"
								/>
							</label>
						) : (
							<button
								key={`dots-${idx}`}
								type="button"
								onClick={() => setIsJumpOpen(true)}
								className="w-7 h-7 rounded-[6px] text-sm border border-gray-light bg-white text-gray-main flex items-center justify-center"
								aria-label="Перейти на страницу"
							>
								…
							</button>
						)
					) : (
						<button
							key={p}
							type="button"
							onClick={() => onPageChange(p)}
							className={cn(
								'w-7 h-7 rounded-[6px] text-sm transition border',
								p === safePage
									? 'bg-accent-light text-dark-menu border-transparent'
									: 'bg-white text-gray-main hover:bg-gray-100 border-gray-light'
							)}
							aria-current={p === safePage ? 'page' : undefined}
						>
							{p}
						</button>
					)
				)}
			</div>

			<button
				type="button"
				className="w-7 h-7 flex items-center justify-center text-gray-main disabled:opacity-40 select-none"
				onClick={() => onPageChange(clamp(safePage + 1, 1, totalPages))}
				disabled={safePage === totalPages}
				aria-label="Next page"
			>
				<span className="text-lg leading-none select-none">›</span>
			</button>
		</nav>
	)
}

export default DictionaryPagination
