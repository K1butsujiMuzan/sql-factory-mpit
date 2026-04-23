interface Props {
	query: string
}

export default function SqlQueryCard({ query }: Props) {
	return (
		<div
			data-chat-scroll
			className="w-full h-[33.333vh] rounded-[10px] border border-[#EBEBEB] bg-white p-4 overflow-auto"
		>
			<div className="text-sm font-medium text-icon-dark mb-2">SQL запрос</div>
			<pre className="text-sm text-gray-main whitespace-pre-wrap break-words">
				{query}
			</pre>
		</div>
	)
}

