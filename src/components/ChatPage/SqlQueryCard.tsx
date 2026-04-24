'use client'

import dynamic from 'next/dynamic'
import { sql } from '@codemirror/lang-sql'
import { EditorView } from '@codemirror/view'

interface Props {
	query: string
}

const CodeMirrorClient = dynamic(
	() => import('@uiw/react-codemirror').then((mod) => mod.default),
	{
		ssr: false,
		loading: () => (
			<div className="h-full w-full rounded-[8px] font-mono text-sm p-2 overflow-auto whitespace-pre-wrap">
				Загрузка...
			</div>
		)
	}
)

export default function SqlQueryCard({ query }: Props) {
	return (
		<div
			data-chat-scroll
			className="flex gap-2 h-full w-full flex-col overflow-auto rounded-10 border border-gray-100 "
		>
			<div className="px-4 pt-4 text-sm font-medium text-icon-dark">
				SQL запрос
			</div>
			<div className="min-h-0 flex-1 px-4 pb-4">
				<CodeMirrorClient
					value={query}
					height="100%"
					readOnly={true}
					basicSetup={{
						lineNumbers: false,
						foldGutter: false,
						highlightActiveLine: false,
						highlightSelectionMatches: false
					}}
					extensions={[
						sql(),
						EditorView.lineWrapping,
						EditorView.editable.of(false)
					]}
					theme="light"
					style={{
						fontSize: '0.875rem',
						fontFamily: 'monospace',
						height: '100%',
						borderRadius: '8px',
						background: '#f9fafb'
					}}
				/>
			</div>
		</div>
	)
}
