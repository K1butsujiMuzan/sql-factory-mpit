export const PAGES = {
	MAIN: '/',
	DICTIONARY: (dbId: string) => `/${dbId}/dictionary`,
	CHAT: (dbId: string, chatId?: string) =>
		`/${dbId}/chat${chatId ? `/${chatId}` : ''}`,
	TEMPLATE: (dbId: string, templateId?: string) =>
		`/${dbId}/template${templateId ? `/${templateId}` : ''}`,
	NEW_TEMPLATE: (dbId: string) => `/${dbId}/new-template`
} as const
