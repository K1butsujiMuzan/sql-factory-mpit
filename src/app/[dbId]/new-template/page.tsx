import CreateTemplateSection from '@/components/CreateTemplateSection/CreateTemplateSection'
import type { Metadata } from 'next'

interface Props {
	params: Promise<{ dbId: string }>
}

export const metadata: Metadata = {
	title: 'Новый шаблон'
}

const CreateTemplatePage = async ({ params }: Props) => {
	const { dbId } = await params

	return <CreateTemplateSection dbId={dbId} />
}

export default CreateTemplatePage
