import SaveReportButton from '@/components/ChatPage/SaveReportButton'
import ResultsTable from '@/components/ChatPage/ResultsTable'
import SqlQueryCard from '@/components/ChatPage/SqlQueryCard'
import ChartAndReasoning from '@/components/ChatPage/ChartAndReasoning'

export type TSqlResult = {
	query: string
	title: string
	table_data: {
		header: string[]
		data: string[][]
	}
	chart_type: string
	reasoning: string
}

interface Props {
	result: TSqlResult
}

export default function ChatPageView({ result }: Props) {
	const { header, data } = result.table_data

	return (
		<div className="w-full px-5 pb-5 pt-0 flex flex-col gap-5">
			<div className="w-full flex items-center justify-end">
				<SaveReportButton />
			</div>

			<div className="w-full grid grid-cols-3 gap-5 min-h-0">
				<section className="col-span-2 min-h-0 flex flex-col gap-5">
					<ResultsTable header={header} data={data} />
					<SqlQueryCard query={result.query} />
				</section>

				<section className="col-span-1 min-h-0">
					<ChartAndReasoning reasoning={result.reasoning} />
				</section>
			</div>
		</div>
	)
}

