'use client'

import { cn } from '@/lib/cn'

interface Props {
	onClick: () => void
	label: string
	isActive: boolean
}

const AsideButton = ({ onClick, label, isActive }: Props) => {
	return (
		<li className={'truncate'}>
			<button
				className={cn('px-3 py-1 rounded-20 flex items-center w-full', {
					'bg-white text-black': isActive
				})}
				type={'button'}
				onClick={onClick}
			>
				<span className={'truncate'}>{label}</span>
			</button>
		</li>
	)
}

export default AsideButton
