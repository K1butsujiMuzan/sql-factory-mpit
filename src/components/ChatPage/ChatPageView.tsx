'use client'

import ReportLayout from '@/components/ReportLayout/ReportLayout'
import Thinking from '@/components/ChatPage/Thinking'
import type { THistory } from '@/shared/types/history.type'

interface Props {
	history: THistory
}

export default function ChatPageView({ history }: Props) {
	const { table_data, query, title, chart_type, reasoning } = history

	if (!table_data) {
		return (
			<div className="w-full h-full p-5 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-2xl">
					<p className="text-lg font-medium">Нет данных</p>
					<p className="text-sm text-gray-500">
						Запрос не вернул данных для отображения.
					</p>
					{query && (
						<pre className="bg-gray-50 rounded-lg p-4 text-left text-sm overflow-auto whitespace-pre-wrap">
							{query}
						</pre>
					)}
					{reasoning && reasoning.length > 0 && (
						<Thinking reasoning={reasoning} />
					)}
				</div>
			</div>
		)
	}

	const { header, data } = table_data

	return (
		<ReportLayout
			header={header}
			data={data}
			query={query}
			title={title}
			chartType={chart_type}
			showThinking={<Thinking reasoning={reasoning} />}
		/>
	)
}
