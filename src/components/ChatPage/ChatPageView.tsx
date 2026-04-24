'use client'

import { useRef } from 'react'
import ResultsTable from '@/components/ChatPage/ResultsTable'
import SqlQueryCard from '@/components/ChatPage/SqlQueryCard'
import type { THistory } from '@/shared/types/history.type'
import Thinking from '@/components/ChatPage/Thinking'
import ChartRenderer, {
	type ChartRendererRef
} from '@/components/ChatPage/ChartRenderer'
import ReportActions from '@/components/ChatPage/ReportActions'

interface Props {
	history: THistory
}

export default function ChatPageView({ history }: Props) {
	const { header, data } = history.table_data
	const chartRef = useRef<ChartRendererRef>(null)

	return (
		<div className="w-full h-full max-h-full p-5 flex flex-col gap-5 max-w-370">
			<div className="w-full flex items-center justify-end gap-2">
				<ReportActions
					header={header}
					data={data}
					title={history.title}
					chartRef={chartRef}
					chartType={history.chart_type}
				/>
			</div>
			<div className="w-full h-full min-h-0 grid grid-cols-[2fr_1fr] gap-5">
				<section className="grid min-h-0 grid-rows-[2fr_1fr] gap-5">
					<ResultsTable header={header} data={data} />
					<SqlQueryCard query={history.query} />
				</section>
				<section className="grid min-h-0 grid-rows-[2fr_1fr] gap-5">
					<ChartRenderer
						ref={chartRef}
						chartType={history.chart_type}
						header={header}
						data={data}
					/>
					<Thinking reasoning={history.reasoning} />
				</section>
			</div>
		</div>
	)
}
