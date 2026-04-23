import { z } from 'zod'
import { DATABASES } from '@/components/LinkForm/link-form.data'

export const dbLinkSchema = z.object({
	host: z.string().min(1, { error: 'Хост обязателен' }),
	port: z
		.number()
		.int()
		.min(1, { error: 'Порт не может быть меньше 1' })
		.max(65535, { error: 'Порт не может быть больше 65535' }),
	user: z.string().min(1, 'Имя пользователя обязательно'),
	password: z.string().min(1, 'Пароль обязателен'),
	dbName: z.string().min(1, 'Имя базы данных обязательно'),
	dbType: z.enum([DATABASES.MYSQL, DATABASES.POSTGRESQL])
})

export type TDbLink = z.infer<typeof dbLinkSchema>
