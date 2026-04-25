import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { ReactNode, MouseEvent } from 'react'

interface Props {
	href: string
	label: string
	isActive?: boolean
	editIcon?: ReactNode
	onEditClick?: (e: MouseEvent) => void
	deleteIcon?: ReactNode
	onDeleteClick?: (e: MouseEvent) => void
}

const AsideMiniLink = ({
	href,
	label,
	isActive,
	editIcon,
	onEditClick,
	deleteIcon,
	onDeleteClick
}: Props) => {
	return (
		<li>
			<Link
				className={cn(
					'group px-3 py-1 rounded-20 flex items-center w-full gap-2',
					isActive && 'text-accent'
				)}
				href={href}
			>
				<span className="truncate text-sm flex-1 min-w-0">{label}</span>
				<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
					{editIcon && onEditClick && (
						<span
							onClick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								onEditClick(e)
							}}
							className="cursor-pointer hover:opacity-80"
							aria-label="Редактировать шаблон"
						>
							{editIcon}
						</span>
					)}
					{deleteIcon && onDeleteClick && (
						<span
							onClick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								onDeleteClick(e)
							}}
							className="cursor-pointer hover:opacity-80"
							aria-label="Удалить шаблон"
						>
							{deleteIcon}
						</span>
					)}
				</div>
			</Link>
		</li>
	)
}

export default AsideMiniLink
