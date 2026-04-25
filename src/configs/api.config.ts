const baseUrl: string =
	process.env.NEXT_PUBLIC_BASE_URL ??
	process.env.BASE_URL ??
	'http://localhost:8080'

const url = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`

export const API = {
	GET_DB_ID: `${url}/executor/test-connect`,
	CREATE_PROMPT: `${url}/executor/prompt`,
	RUN_TEMPLATE: `${url}/executor/template`,
	UPDATE_TEMPLATE: `${url}/template`,
	CREATE_TEMPLATE: `${url}/template`,
	DELETE_TEMPLATE: (templateId: string) => `${url}/template?id=${templateId}`,
	GET_HISTORY: (dbId: string) => `${url}/history?db=${dbId}`,
	GET_HISTORY_ITEM: (id: string) => `${url}/history/item?id=${id}`,
	GET_TEMPLATE_ITEM: (id: string) => `${url}/template?id=${id}`,
	GET_TEMPLATES: (dbId: string) => `${url}/templates?db=${dbId}`,

	GET_DICT: (dbId: string) => `${url}/dict?db=${dbId}`,
	DICT_ITEM: `${url}/dict/item`,
	DELETE_DICT_ITEM: (id: number) => `${url}/dict/item?id=${id}`
}
