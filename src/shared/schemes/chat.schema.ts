import { z } from 'zod'

export const chatSchema = z.object({
	text: z.string().min(10, { error: 'минимальное количество символов - 10' })
})

export type TChat = z.infer<typeof chatSchema>
