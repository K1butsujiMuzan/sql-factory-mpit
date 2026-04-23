import Link from 'next/link'
import { PAGES } from '@/configs/pages.config'

interface Props {
	dbId: string
}

const CreateTemplateLink = ({ dbId }: Props) => {
	return (
		<Link
			href={PAGES.NEW_TEMPLATE(dbId)}
			className={
				'px-3 py-1 bg-accent text-white flex justify-between items-center rounded-20'
			}
		>
			<span>Создать</span>
			<svg
				role={'img'}
				aria-hidden={true}
				width="13"
				height="13"
				viewBox="0 0 13 13"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M6.5 0.5L6.5 12.5" stroke="white" strokeLinecap="round" />
				<path d="M12.5 6.5L0.5 6.5" stroke="white" strokeLinecap="round" />
			</svg>
		</Link>
	)
}

export default CreateTemplateLink
