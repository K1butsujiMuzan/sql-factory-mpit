import { create } from 'zustand/react'
import type { TDbLink } from '@/shared/schemes/db-link.schema'

type TStoreActions = {
	setDb: (data: TDbLink) => void
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

const useDbStore = create<TDbStore>()((set) => ({
	...initialState,
	setDb: (data) => set(data)
}))

export const setDb = (data: TDbLink) => useDbStore.getState().setDb(data)
