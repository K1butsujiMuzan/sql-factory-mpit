'use client'

import { useRef } from 'react'
import ResultsTable from '@/components/ChatPage/ResultsTable'
import SqlQueryCard from '@/components/ChatPage/SqlQueryCard'
import ChartRenderer, {
	type ChartRendererRef
} from '@/components/ChatPage/ChartRenderer'
import ReportActions from '@/components/ChatPage/ReportActions'
import type { TTemplate } from '@/shared/types/template.type'

interface Props {
	template: TTemplate
	dbId: string
}

export default function TemplatePageView({ template, dbId }: Props) {
	const { table_data, query, title, chart_type } = template
	const chartRef = useRef<ChartRendererRef>(null)

	const { header, data } = table_data!

	return (
		<div className="w-full h-full max-h-full p-5 flex flex-col gap-5 max-w-370">
			<div className="w-full flex items-center justify-end gap-2">
				<ReportActions
					header={header}
					data={data}
					title={title}
					chartRef={chartRef}
					chartType={chart_type}
				/>
			</div>

			<div className="w-full h-full min-h-0 grid grid-rows-[1fr_auto] gap-5">
				<div className="grid grid-cols-[2fr_1fr] gap-5 min-h-0">
					<ResultsTable header={header} data={data} />
					<ChartRenderer
						ref={chartRef}
						chartType={chart_type}
						header={header}
						data={data}
					/>
				</div>
				<SqlQueryCard query={query} />
			</div>
		</div>
	)
}
