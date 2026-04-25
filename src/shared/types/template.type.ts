import type { THistory } from '@/shared/types/history.type'

export type TTemplate = Omit<THistory, 'reasoning'> & {
	table_data: THistory['table_data'] | null
}
