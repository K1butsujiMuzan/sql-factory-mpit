'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import type { ChartRendererRef } from '@/components/ChatPage/ChartRenderer'
import type { TChartType } from '@/constants/chart-types'

interface Props {
	header: string[]
	data: string[][]
	title: string
	chartRef: React.RefObject<ChartRendererRef | null>
	chartType: TChartType
}

export default function ReportActions({
	header,
	data,
	title,
	chartRef,
	chartType
}: Props) {
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const popupRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsPopupOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const downloadExcel = useCallback(() => {
		const worksheetData = [header, ...data]
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные')

		const safeTitle = title.replace(/[^a-zа-яё0-9]/gi, '_').substring(0, 30)
		XLSX.writeFile(workbook, `${safeTitle}.xlsx`)
	}, [header, data, title])

	const getChartImage = useCallback((): string | null => {
		const base64 = chartRef?.current?.getImage?.()
		if (!base64) {
			console.error('Не удалось получить изображение графика')
			return null
		}
		return base64
	}, [chartRef])

	const downloadChartPdf = useCallback(() => {
		const base64 = getChartImage()
		if (!base64) return

		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		})

		const pageWidth = pdf.internal.pageSize.getWidth()
		const pageHeight = pdf.internal.pageSize.getHeight()
		const margin = 10
		const imgWidth = pageWidth - margin * 2
		const imgHeight = pageHeight - margin * 2

		pdf.addImage(
			base64,
			'PNG',
			margin,
			margin,
			imgWidth,
			imgHeight,
			undefined,
			'FAST'
		)

		const safeTitle = title.replace(/[^a-zа-яё0-9]/gi, '_').substring(0, 30)
		pdf.save(`${safeTitle}_chart.pdf`)
	}, [getChartImage, title])

	const downloadChartPng = useCallback(() => {
		const base64 = getChartImage()
		if (!base64) return

		const link = document.createElement('a')
		link.href = base64
		const safeTitle = title.replace(/[^a-zа-яё0-9]/gi, '_').substring(0, 30)
		link.download = `${safeTitle}_chart.png`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}, [getChartImage, title])

	const handlePopupAction = (action: 'pdf' | 'png') => {
		setIsPopupOpen(false)
		if (action === 'pdf') {
			downloadChartPdf()
		} else {
			downloadChartPng()
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={downloadExcel}
				className="bg-accent text-white py-1.5 px-4 rounded-10 font-medium"
			>
				Скачать таблицу
			</button>
			{chartType !== 'none' && (
				<div className="relative">
					<button
						ref={buttonRef}
						type="button"
						onClick={() => setIsPopupOpen(!isPopupOpen)}
						className="bg-accent text-white py-1.5 px-4 rounded-10 font-medium"
					>
						Сохранить график
					</button>
					{isPopupOpen && (
						<div
							ref={popupRef}
							className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
						>
							<button
								onClick={() => handlePopupAction('pdf')}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
							>
								Сохранить в PDF
							</button>
							<button
								onClick={() => handlePopupAction('png')}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
							>
								Сохранить в PNG
							</button>
						</div>
					)}
				</div>
			)}
		</>
	)
}
