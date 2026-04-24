import { API } from '@/configs/api.config'
import type { THistory } from '@/shared/types/history.type'

export const getChatData = async (chatId: string): Promise<null | THistory> => {
	try {
		const response = await fetch(API.GET_HISTORY_ITEM(chatId), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})

		if (!response.ok) {
			return null
		}

		const serverData: { error: string } | THistory = await response.json()

		if ('error' in serverData) {
			return null
		}
		return serverData
	} catch (error) {
		console.error(error)
		return null
	}
}
