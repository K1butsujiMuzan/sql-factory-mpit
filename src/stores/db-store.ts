import { create } from 'zustand'
import type { TDbLink } from '@/shared/schemes/db-link.schema'

type TStoreActions = {
	setDb: (data: TDbLink) => void
	getDbData: () => TDbLink
}

const initialState: TDbLink = {
	dbType: 'postgres',
	host: '',
	port: 1,
	user: '',
	password: '',
	dbName: ''
}

type TDbStore = TDbLink & TStoreActions

const useDbStore = create<TDbStore>()((set, get) => ({
	...initialState,
	setDb: (data) => set(data),
	getDbData: () => {
		const { setDb, getDbData, ...state } = get()
		return state
	}
}))

export const setDb = (data: TDbLink) => useDbStore.getState().setDb(data)
export const getDbData = () => useDbStore.getState().getDbData()
