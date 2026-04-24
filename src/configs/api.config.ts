const url: string = process.env.BASE_URL ?? 'http://localhost:8080/api'

export const API = {
	GET_DB_ID: `${url}/executor/test-connect`,
	CREATE_PROMPT: `${url}/executor/prompt`,
	CREATE_TEMPLATE: `${url}/template`,
	GET_HISTORY: (dbId: string) => `${url}/history?db=${dbId}`,
	GET_HISTORY_ITEM: (id: string) => `${url}/history/item?id=${id}`,
	GET_TEMPLATES: (dbId: string) => `${url}/templates?db=${dbId}`
}
