import Link from 'next/link'
import { PAGES } from '@/configs/pages.config'

interface Props {
	dbId: string
}

const BackLink = ({ dbId }: Props) => {
	return (
		<Link
			href={PAGES.CHAT(dbId)}
			className={
				'absolute left-0 top-0 py-2.5 px-3 rounded-20 border border-gray-100'
			}
		>
			<svg
				role={'img'}
				aria-hidden={true}
				width="31"
				height="8"
				viewBox="0 0 31 8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M30.5 4.18201C30.7761 4.18201 31 3.95815 31 3.68201C31 3.40586 30.7761 3.18201 30.5 3.18201V3.68201V4.18201ZM0.146446 3.32845C-0.0488148 3.52372 -0.0488148 3.8403 0.146446 4.03556L3.32843 7.21754C3.52369 7.4128 3.84027 7.4128 4.03553 7.21754C4.2308 7.02228 4.2308 6.7057 4.03553 6.51043L1.20711 3.68201L4.03553 0.85358C4.2308 0.658318 4.2308 0.341735 4.03553 0.146473C3.84027 -0.0487893 3.52369 -0.0487893 3.32843 0.146473L0.146446 3.32845ZM30.5 3.68201V3.18201L0.5 3.18201V3.68201V4.18201L30.5 4.18201V3.68201Z"
					fill="white"
				/>
			</svg>
		</Link>
	)
}

export default BackLink
