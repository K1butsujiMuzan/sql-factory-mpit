import type {TSelect} from "@/shared/types/select.type";

export const DATABASES = {
  MYSQL: 'mysql',
  POSTGRESQL: 'postgresql'
} as const

export const linkFormData: TSelect[] = [
  {
    text: 'PostgreSQL',
    value: DATABASES.POSTGRESQL
  },
  {
    text: 'MySQL',
    value: DATABASES.MYSQL
  },
]