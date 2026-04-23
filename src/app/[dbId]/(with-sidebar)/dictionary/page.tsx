import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Словарь'
}

const DictionaryPage = () => {
	return (
    <section>
      <div>
        <span>Слово</span>
        <span>Значение</span>
      </div>
      <ul>

      </ul>
    </section>
  )
}

export default DictionaryPage
