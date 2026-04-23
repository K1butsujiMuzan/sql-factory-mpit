import Link from 'next/link'
import { cn } from '@/lib/cn'
import AsideActiveIcon from '@/components/Aside/AsideActiveIcon'

interface Props {
	href: string
	label: string
	isActive?: boolean
}

const AsideLink = ({ href, label, isActive }: Props) => {
	return (
		<li>
			<Link
				className={cn(
					'px-3 py-1 rounded-20 flex items-center w-full justify-between',
					{
						'bg-gray-100': isActive
					}
				)}
				href={href}
			>
				<span className={'truncate'}>{label}</span>
				{isActive && <AsideActiveIcon />}
			</Link>
		</li>
	)
}

export default AsideLink
