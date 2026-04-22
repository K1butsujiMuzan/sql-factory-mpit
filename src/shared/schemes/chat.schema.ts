import {z} from "zod";

export const chatSchema = z.object({
  text: z.string()
})

export type TChat = z.infer<typeof chatSchema>