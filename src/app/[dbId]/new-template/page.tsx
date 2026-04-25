import CreateTemplateSection from '@/components/CreateTemplateSection/CreateTemplateSection'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import { COOKIES } from '@/configs/cookies.config'

interface Props {
	params: Promise<{ dbId: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
	title: 'Новый шаблон'
}

const CreateTemplatePage = async ({ params, searchParams }: Props) => {
	const { dbId } = await params
	const sp = searchParams ? await searchParams : {}
	const cookieStore = await cookies()
	const dbIdFromCookie = cookieStore.get(COOKIES.DB_ID)?.value

	if (!dbIdFromCookie) return redirect(PAGES.MAIN)
	if (dbId !== dbIdFromCookie) return redirect(PAGES.CHAT(dbIdFromCookie))

	const initialTitle = typeof sp.title === 'string' ? sp.title : undefined
	const initialQuery = typeof sp.query === 'string' ? sp.query : undefined
	const initialChartType =
		typeof sp.chartType === 'string' ? sp.chartType : undefined
	const templateId =
		typeof sp.templateId === 'string' ? Number(sp.templateId) : undefined

	return (
		<CreateTemplateSection
			dbId={dbId}
			initialTitle={initialTitle}
			initialQuery={initialQuery}
			initialChartType={initialChartType}
			templateId={templateId}
		/>
	)
}

export default CreateTemplatePage
