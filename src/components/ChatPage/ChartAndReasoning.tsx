import ReasoningText from '@/components/ChatPage/ReasoningText'

interface Props {
	reasoning: string
}

export default function ChartAndReasoning({ reasoning }: Props) {
	return (
		<div className="w-full h-[calc(50vh+33.333vh+20px)] flex flex-col gap-5">
			<div className="h-[calc(50vh-40px)] bg-white rounded-[10px] border border-[#ECECEC]" />

			<div
				data-chat-scroll
				className="h-[calc(33.333vh+40px)] rounded-[10px] border border-[#EBEBEB] bg-white p-4 overflow-auto"
			>
				<div className="text-sm font-medium text-icon-dark mb-2">
					Как нейронка думала
				</div>
				<ReasoningText text={reasoning} />
			</div>
		</div>
	)
}

