'use client'

import { useRef, type ReactNode } from 'react'
import ResultsTable from '@/components/ChatPage/ResultsTable'
import SqlQueryCard from '@/components/ChatPage/SqlQueryCard'
import ChartRenderer, {
	type ChartRendererRef
} from '@/components/ChatPage/ChartRenderer'
import ReportActions from '@/components/ChatPage/ReportActions'
import type { TChartType } from '@/constants/chart-types'

interface Props {
	header: string[]
	data: string[][]
	query: string
	title: string
	chartType: TChartType
	showThinking?: ReactNode
}

export default function ReportLayout({
	header,
	data,
	query,
	title,
	chartType,
	showThinking
}: Props) {
	const chartRef = useRef<ChartRendererRef>(null)

	return (
		<div className="w-full h-full max-h-full p-5 flex flex-col gap-5 max-w-370">
			<div className="w-full flex items-center justify-end gap-2">
				<ReportActions
					header={header}
					data={data}
					title={title}
					chartRef={chartRef}
					chartType={chartType}
				/>
			</div>

			<div className="w-full h-full min-h-0 grid grid-cols-[2fr_1fr] gap-5">
				<section className="grid min-h-0 grid-rows-[2fr_1fr] gap-5">
					<ResultsTable header={header} data={data} />
					<SqlQueryCard query={query} />
				</section>
				<section className="grid min-h-0 grid-rows-[2fr_1fr] gap-5">
					<ChartRenderer
						ref={chartRef}
						chartType={chartType}
						header={header}
						data={data}
					/>
					{showThinking ?? <div />}
				</section>
			</div>
		</div>
	)
}
