import RequestSection from '@/components/RequestSection/RequestSection'
import ChatForm from '@/components/ChatForm/ChatForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Новый чат'
}

interface Props {
	params: Promise<{ dbId: string }>
}

const NewChatPage = async ({ params }: Props) => {
	const { dbId } = await params

	return (
		<RequestSection
			text={'Добрый день, что хотите узнать?'}
			className={'max-w-121'}
		>
			<ChatForm dbId={dbId} />
		</RequestSection>
	)
}

export default NewChatPage
