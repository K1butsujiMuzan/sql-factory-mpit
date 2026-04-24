import ChatPageView from '@/components/ChatPage/ChatPageView'
import { getChatData } from '@/services/getChatData'
import { redirect } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'

interface Props {
	params: Promise<{ dbId: string; chatId: string }>
}

export default async function ChatPage({ params }: Props) {
	const { dbId, chatId } = await params

	const data = await getChatData(chatId)

	if (!data) {
		return redirect(PAGES.CHAT(dbId))
	}

	return <ChatPageView history={data} />
}
