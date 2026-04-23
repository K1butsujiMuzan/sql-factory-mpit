import LinkForm from '@/components/LinkForm/LinkForm'
import RequestSection from '@/components/RequestSection/RequestSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Вход - SQLFactory'
}

export default function Home() {
	return (
		<main>
			<RequestSection text={'SQLFactory'}>
				<LinkForm />
			</RequestSection>
		</main>
	)
}
