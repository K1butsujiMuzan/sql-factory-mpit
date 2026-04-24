'use client'

import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { TChartType } from '@/constants/chart-types'

interface Props {
	header: string[]
	data: string[][]
	title: string
	chartType: TChartType
}

type TableProps = { header: string[]; data: string[][] }
type ChartProps = {
	chartType: Props['chartType']
	header: string[]
	data: string[][]
}

const PrintContent = ({ header, data, title, chartType }: Props) => {
	const [TableComp, setTableComp] =
		useState<React.ComponentType<TableProps> | null>(null)
	const [ChartComp, setChartComp] =
		useState<React.ComponentType<ChartProps> | null>(null)

	useEffect(() => {
		import('./ResultsTable').then((mod) => setTableComp(() => mod.default))
		import('./ChartRenderer').then((mod) => setChartComp(() => mod.default))
	}, [])

	if (!TableComp || !ChartComp) {
		return <div style={{ padding: '20px' }}>Загрузка...</div>
	}

	return (
		<div
			style={{
				padding: '30px',
				background: 'white',
				width: '800px',
				fontFamily: 'Arial, sans-serif'
			}}
		>
			<h1
				style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}
			>
				{title}
			</h1>
			<TableComp header={header} data={data} />
			{chartType !== 'none' && (
				<div style={{ marginTop: '30px' }}>
					<ChartComp chartType={chartType} header={header} data={data} />
				</div>
			)}
		</div>
	)
}

export default function SaveReportButton({
	header,
	data,
	title,
	chartType
}: Props) {
	const [isGenerating, setIsGenerating] = useState(false)

	const generatePDF = async () => {
		if (isGenerating) return
		setIsGenerating(true)

		const container = document.createElement('div')
		container.style.position = 'absolute'
		container.style.top = '-9999px'
		container.style.left = '-9999px'
		document.body.appendChild(container)

		let root: Root | null = null

		try {
			root = createRoot(container)
			root.render(
				<PrintContent
					header={header}
					data={data}
					title={title}
					chartType={chartType}
				/>
			)
			await new Promise((resolve) => setTimeout(resolve, 500))

			const canvas = await html2canvas(container, {
				scale: 2,
				backgroundColor: '#ffffff',
				logging: false,
				useCORS: true,
				allowTaint: false
			})

			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			})

			const pdfWidth = pdf.internal.pageSize.getWidth()
			const pdfHeight = pdf.internal.pageSize.getHeight()
			const imgWidth = pdfWidth
			const imgHeight = (canvas.height * imgWidth) / canvas.width

			let heightLeft = imgHeight
			let position = 0

			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
			heightLeft -= pdfHeight

			while (heightLeft > 0) {
				position = heightLeft - imgHeight
				pdf.addPage()
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
				heightLeft -= pdfHeight
			}

			const safeTitle = title.replace(/[^a-zа-яё0-9]/gi, '_').substring(0, 50)
			pdf.save(
				`${safeTitle}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`
			)
		} catch (error) {
			console.error('Ошибка при создании PDF:', error)
		} finally {
			if (root) root.unmount()
			document.body.removeChild(container)
			setIsGenerating(false)
		}
	}

	return (
		<button
			type="button"
			onClick={generatePDF}
			disabled={isGenerating}
			className="bg-accent text-white py-1.5 px-21.5 rounded-10 font-medium disabled:opacity-50"
		>
			{isGenerating ? 'Создание PDF...' : 'Сохранить отчёт'}
		</button>
	)
}
