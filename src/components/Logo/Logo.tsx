import Link from 'next/link'
import { PAGES } from '@/configs/pages.config'

interface Props {
	dbId?: string
}

const Logo = ({ dbId }: Props) => {
	return (
		<Link
			href={dbId ? PAGES.CHAT(dbId) : PAGES.MAIN}
			className={'text-gray-light'}
		>
			SQLFactory
		</Link>
	)
}

export default Logo
