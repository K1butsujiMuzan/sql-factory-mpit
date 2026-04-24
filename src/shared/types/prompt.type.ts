import type { TChartType } from '@/constants/chart-types'

export type TPrompt = {
	chart_type: TChartType
	history_id: number
	query: string
	reasoning: string[]
	table_data: {
		data: string[][]
		header: string[]
	}
	title: string
}
