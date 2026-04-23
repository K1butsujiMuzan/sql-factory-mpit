'use client'

import { cn } from '@/lib/cn'
import AsideActiveIcon from '@/components/Aside/AsideActiveIcon'

interface Props {
	onClick: () => void
	label: string
	isActive: boolean
}

const AsideButton = ({ onClick, label, isActive }: Props) => {
	return (
		<li className={'truncate'}>
			<button
				className={cn(
					'px-3 py-1 rounded-20 flex items-center w-full justify-between',
					{
						'bg-gray-100': isActive
					}
				)}
				type={'button'}
				onClick={onClick}
			>
				<span className={'truncate'}>{label}</span>
				{isActive && <AsideActiveIcon />}
			</button>
		</li>
	)
}

export default AsideButton
