import { API } from '@/configs/api.config'
import type { TTemplate } from '@/shared/types/template.type'

export const getTemplateData = async (
	templateId: string
): Promise<null | { error: string } | TTemplate> => {
	try {
		const response = await fetch(API.GET_TEMPLATE_ITEM(templateId), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})

		if (!response.ok) {
			return null
		}

		const serverData: { error: string } | TTemplate = await response.json()

		if (!serverData) {
			return null
		}

		if ('error' in serverData) {
			return { error: 'Not found' }
		}

		return serverData
	} catch (error) {
		console.error(error)
		return { error: 'Not found' }
	}
}
