export const PAGES = {
  MAIN: '/',
  CHAT: (id?: string) => `/chat${id ? `/${id}`: ''}`,
  DICTIONARY: 'dictionary'
} as const