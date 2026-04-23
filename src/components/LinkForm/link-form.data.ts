import type { TSelect } from '@/shared/types/select.type'

export const DATABASES = {
	MYSQL: 'mysql',
	POSTGRESQL: 'postgres'
} as const

export const linkFormData: TSelect[] = [
	{
		text: 'PostgreSQL',
		value: DATABASES.POSTGRESQL
	},
	{
		text: 'MySQL',
		value: DATABASES.MYSQL
	}
]
