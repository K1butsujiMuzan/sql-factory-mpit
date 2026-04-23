import type { Metadata } from 'next'
import DictionaryView from '@/components/Dictionary/DictionaryView'

export const metadata: Metadata = {
	title: 'Словарь'
}

const DictionaryPage = () => {
	return <DictionaryView />
}

export default DictionaryPage
