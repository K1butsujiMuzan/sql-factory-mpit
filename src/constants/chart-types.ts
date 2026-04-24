import type { TSelect } from '@/shared/types/select.type'

export const CHART_TYPES = ['none', 'line', 'pie', 'histogram'] as const

export const CHART_SELECT: TSelect[] = CHART_TYPES.map((item) => ({
	value: item,
	text: item[0].toUpperCase() + item.slice(1)
}))

export type TChartType = (typeof CHART_TYPES)[number]
