import { getTemplateData } from '@/services/getTemplateData'
import { getTemplates } from '@/services/getTemplates'
import { notFound, redirect } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import TemplatePageView from '@/components/TemplatePage/TemplatePageView'

interface Props {
	params: Promise<{ dbId: string; templateId: string }>
}

export default async function TemplatePage({ params }: Props) {
	const { dbId, templateId } = await params

	const [templateData, templates] = await Promise.all([
		getTemplateData(templateId),
		getTemplates(dbId)
	])

	if (templateData && !('error' in templateData)) {
		if (!templateData.table_data) {
			const meta = templates.find((t) => t.id.toString() === templateId)
			if (meta) {
				const query = new URLSearchParams({
					title: meta.title,
					query: meta.query,
					chartType: meta.chart_type,
					templateId: meta.id.toString()
				}).toString()
				return redirect(`${PAGES.NEW_TEMPLATE(dbId)}?${query}`)
			}
			notFound()
		}
		return <TemplatePageView template={templateData} dbId={dbId} />
	}

	if (templateData !== null && 'error' in templateData) {
		notFound()
	}

	const meta = templates.find((t) => t.id.toString() === templateId)
	if (!meta) {
		notFound()
	}

	const query = new URLSearchParams({
		title: meta.title,
		query: meta.query,
		chartType: meta.chart_type,
		templateId: meta.id.toString()
	}).toString()

	return redirect(`${PAGES.NEW_TEMPLATE(dbId)}?${query}`)
}
