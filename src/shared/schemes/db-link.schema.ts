import {z} from "zod";
import {DATABASES} from "@/components/LinkForm/link-form.data";

export const dbLinkSchema = z.object({
  link: z.string({error: 'Некорректная ссылка'}).regex(/^(mongodb(\+srv)?|postgres(ql)?|mysql|redis|jdbc:[a-z]+):\/\/(.+:.+@)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/.*)?$/, {
    error: 'некорректная ссылка'
  }),
  dbType: z.enum([DATABASES.MYSQL, DATABASES.POSTGRESQL])
})

export type TDbLink = z.infer<typeof dbLinkSchema>