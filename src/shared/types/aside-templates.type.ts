import type { TChartType } from '@/constants/chart-types'

export type TAsideTemplate = {
	id: number
	db: string
	title: string
	query: string
	chart_type: TChartType
}
