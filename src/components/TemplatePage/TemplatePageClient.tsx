'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplatePageView from './TemplatePageView'
import { PAGES } from '@/configs/pages.config'
import type { TTemplate } from '@/shared/types/template.type'
import { getTemplateData } from '@/services/getTemplateData'

interface Props {
	dbId: string
	templateId: string
	initialData: TTemplate | null
	meta:
		| { title: string; query: string; chart_type: string; id: number }
		| undefined
}

export default function TemplatePageClient({
	dbId,
	templateId,
	initialData,
	meta
}: Props) {
	const router = useRouter()
	const [templateData, setTemplateData] = useState<TTemplate | null>(
		initialData
	)
	const [polling, setPolling] = useState(!initialData)

	useEffect(() => {
		if (!initialData && meta) {
			const interval = setInterval(async () => {
				try {
					const data = await getTemplateData(templateId)
					if (data && !('error' in data)) {
						setTemplateData(data)
						setPolling(false)
						clearInterval(interval)
					}
				} catch {}
			}, 1500)

			const timeout = setTimeout(() => {
				clearInterval(interval)
				setPolling(false)
				const query = new URLSearchParams({
					title: meta.title,
					query: meta.query,
					chartType: meta.chart_type,
					templateId: meta.id.toString()
				}).toString()
				router.replace(`${PAGES.NEW_TEMPLATE(dbId)}?${query}`)
			}, 10000)

			return () => {
				clearInterval(interval)
				clearTimeout(timeout)
			}
		}
	}, [initialData, templateId, dbId, router, meta])

	if (templateData) {
		return <TemplatePageView dbId={dbId} template={templateData} />
	}

	if (!meta) {
		return <div className="p-5 text-gray-500">Шаблон не найден</div>
	}

	return (
		<div className="p-5 text-gray-500">
			Ожидание выполнения шаблона...
			{polling && <span className="ml-2 animate-spin inline-block">⏳</span>}
		</div>
	)
}
