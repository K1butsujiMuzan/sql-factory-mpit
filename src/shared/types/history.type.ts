import type { TChartType } from '@/constants/chart-types'

export type THistory = {
	id: number
	user_id: number
	db: string
	created_at: string
	title: string
	prompt: string
	query: string
	table_data: {
		header: string[]
		data: string[][]
	}
	chart_type: TChartType
	reasoning: string[]
}
