import CreateTemplateSection from '@/components/CreateTemplateSection/CreateTemplateSection'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'

interface Props {
	params: Promise<{ dbId: string }>
}

export const metadata: Metadata = {
	title: 'Новый шаблон'
}

const CreateTemplatePage = async ({ params }: Props) => {
	const { dbId } = await params
	const cookieStore = await cookies()
	const dbIdFromCookie = cookieStore.get('db_id')?.value

	if (!dbIdFromCookie) {
		return redirect(PAGES.MAIN)
	}

	if (dbId !== dbIdFromCookie) {
		return redirect(PAGES.CHAT(dbIdFromCookie))
	}

	return <CreateTemplateSection dbId={dbId} />
}

export default CreateTemplatePage
