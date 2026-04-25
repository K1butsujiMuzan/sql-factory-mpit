import { API } from '@/configs/api.config'
import type { TAsideTemplate } from '@/shared/types/aside-templates.type'

export const getTemplates = async (dbId: string): Promise<TAsideTemplate[]> => {
	try {
		const response = await fetch(API.GET_TEMPLATES(dbId))
		if (!response.ok) return []
		const data = await response.json()
		return Array.isArray(data) ? data : []
	} catch (error) {
		console.error(error)
		return []
	}
}
