import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Props {
	href: string
	label: string
	isActive?: boolean
}

const AsideLink = ({ href, label, isActive }: Props) => {
	return (
		<li>
			<Link
				className={cn('px-3 py-1 rounded-20 flex items-center w-full', {
					'bg-white text-black': isActive
				})}
				href={href}
			>
				<span className={'truncate'}>{label}</span>
			</Link>
		</li>
	)
}

export default AsideLink
