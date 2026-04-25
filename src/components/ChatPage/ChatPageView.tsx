'use client'

import ReportLayout from '@/components/ReportLayout/ReportLayout'
import Thinking from '@/components/ChatPage/Thinking'
import type { THistory } from '@/shared/types/history.type'

interface Props {
	history: THistory
}

export default function ChatPageView({ history }: Props) {
	const { header, data } = history.table_data

	return (
		<ReportLayout
			header={header}
			data={data}
			query={history.query}
			title={history.title}
			chartType={history.chart_type}
			showThinking={<Thinking reasoning={history.reasoning} />}
		/>
	)
}
