const url: string = process.env.BASE_URL ?? 'http://localhost:8080/api'

export const API = {
	GET_DB_ID: `${url}/executor/test-connect`,
	CREATE_PROMPT: `${url}/executor/prompt`
}
