import { formatIsoUtcDatesInText } from '@/lib/format-iso-date'

interface Props {
	reasoning: string[]
}

const Thinking = ({ reasoning }: Props) => {
	return (
		<ul
			className={
				'rounded-10 border border-[#EBEBEB] bg-white p-4 overflow-auto'
			}
		>
			{reasoning.map((item, index) => (
				<li key={`item-${index}`}>{formatIsoUtcDatesInText(item)}</li>
			))}
		</ul>
	)
}

export default Thinking
