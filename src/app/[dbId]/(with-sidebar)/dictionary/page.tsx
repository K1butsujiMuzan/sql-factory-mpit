import type { Metadata } from 'next'
import DictionaryView from '@/components/Dictionary/DictionaryView'

export const metadata: Metadata = {
	title: 'Словарь'
}

const DictionaryPage = async ({ params }: { params: Promise<{ dbId: string }> }) => {
	const { dbId } = await params
	return <DictionaryView dbId={dbId} />
}

export default DictionaryPage
