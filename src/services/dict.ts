import { API } from '@/configs/api.config'

export type TDictItem = {
	id: number
	db: string
	word: string
	meaning: string
}

export type TDictResponse =
	| TDictItem[]
	| { items: TDictItem[] }
	| { data: TDictItem[] }
	| Record<string, string>

export async function getDict(dbId: string): Promise<TDictResponse> {
	try {
		const response = await fetch(API.GET_DICT(dbId), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})

		if (!response.ok) {
			const data: unknown = await response.json().catch(() => null)
			const message =
				typeof data === 'object' && data && 'error' in data
					? String((data as { error: string }).error)
					: `ошибка загрузки (${response.status})`
			throw new Error(message)
		}

		return (await response.json().catch(() => null)) as TDictResponse
	} catch (e) {
		console.error(e)
		throw e
	}
}

export async function addDictItem(payload: {
	db: string
	word: string
	meaning: string
}): Promise<{ id: number } | { error: string }> {
	const response = await fetch(API.DICT_ITEM, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const data: unknown = await response.json().catch(() => null)

	if (!response.ok) {
		return {
			error:
				typeof data === 'object' && data && 'error' in data
					? String((data as { error: string }).error)
					: 'ошибка сохранения'
		}
	}

	if (typeof data === 'object' && data && 'error' in data) {
		return { error: String((data as { error: string }).error) }
	}

	if (typeof data === 'object' && data && 'id' in data) {
		return { id: Number((data as { id: number }).id) }
	}

	return { error: 'ошибка сохранения' }
}

export async function updateDictItem(payload: {
	id: number
	db: string
	word: string
	meaning: string
}): Promise<null | { error: string }> {
	const response = await fetch(API.DICT_ITEM, {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (response.ok) return null

	const data: unknown = await response.json().catch(() => null)
	return {
		error:
			typeof data === 'object' && data && 'error' in data
				? String((data as { error: string }).error)
				: 'ошибка сохранения'
	}
}

export async function deleteDictItem(id: number): Promise<null | { error: string }> {
	const response = await fetch(API.DELETE_DICT_ITEM(id), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})

	if (response.ok) return null

	const data: unknown = await response.json().catch(() => null)
	return {
		error:
			typeof data === 'object' && data && 'error' in data
				? String((data as { error: string }).error)
				: 'ошибка удаления'
	}
}

