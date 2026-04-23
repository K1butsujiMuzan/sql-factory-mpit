import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Props {
	href: string
	label: string
	isActive?: boolean
}

const AsideMiniLink = ({ href, label, isActive }: Props) => {
	return (
		<li>
			<Link
				className={cn('px-3 py-1 rounded-20 flex items-center w-full', {
					'text-accent': isActive
				})}
				href={href}
			>
				<span className={'truncate text-sm'}>{label}</span>
			</Link>
		</li>
	)
}

export default AsideMiniLink
