'use client'

import { type ChangeEvent, useState } from 'react'
import Input from '@/components/Input/Input'
import ReactCodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { githubDark } from '@uiw/codemirror-theme-github'
import BackLink from '@/components/CreateTemplateSection/BackLink'

interface Props {
	dbId: string
}

const CreateTemplateSection = ({ dbId }: Props) => {
	const [title, setTitle] = useState<string>('')
	const [code, setCode] = useState<string>('')

	return (
		<div
			className={
				'flex items-center flex-col gap-5 w-full max-w-370 mx-auto p-5'
			}
		>
			<div className={'relative w-full flex justify-center'}>
				<BackLink dbId={dbId} />
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center w-full max-w-79'
					}
				>
					<Input
						className={'text-center'}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setTitle(event.target.value)
						}
						value={title}
						label={'Введите название'}
						inputId={'template-id'}
					/>
				</div>
			</div>
			<div className={'flex gap-5 w-full'}>
				<button
					className={
						'text-accent bg-white flex gap-2 items-center px-3 py-1 rounded-20'
					}
					type={'button'}
				>
					<svg
						role={'img'}
						aria-hidden={true}
						width="11"
						height="12"
						viewBox="0 0 11 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9.21009 5.15313L2.35399 0.696668C1.55568 0.177771 0.5 0.750675 0.5 1.7028V10.2804C0.5 11.2325 1.55569 11.8054 2.35399 11.2865L9.21009 6.83002C9.81677 6.43568 9.81677 5.54748 9.21009 5.15313Z"
							stroke="#7161EF"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span>Запустить</span>
				</button>
				<button
					className={
						'bg-accent text-white flex gap-2 items-center px-3 py-1 rounded-20'
					}
					type={'button'}
				>
					<svg
						role={'img'}
						aria-hidden={true}
						width="18"
						height="14"
						viewBox="0 0 18 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.5 7.5H14.9415C14.2458 7.5 13.8979 7.5 13.636 7.68876C13.3742 7.87752 13.2642 8.20753 13.0442 8.86754L12.9558 9.13246C12.7358 9.79247 12.6258 10.1225 12.364 10.3112C12.1021 10.5 11.7542 10.5 11.0585 10.5H6.94152C6.2458 10.5 5.89794 10.5 5.63605 10.3112C5.37416 10.1225 5.26416 9.79247 5.04415 9.13246L4.95585 8.86754C4.73584 8.20753 4.62584 7.87752 4.36395 7.68876C4.10206 7.5 3.7542 7.5 3.05848 7.5H0.5"
							stroke="white"
						/>
						<path
							d="M6.5 4.5L9 7M9 7L11.5 4.5M9 7L9 1.09278e-07"
							stroke="white"
						/>
						<path
							d="M3.5 3.5L1.78246 4.64502C1.31358 4.95761 1.07914 5.11391 0.909418 5.3204C0.759165 5.50321 0.646433 5.71386 0.577671 5.94028C0.5 6.19604 0.5 6.4778 0.5 7.04133V10.62C0.5 11.6281 0.5 12.1321 0.696188 12.5172C0.86876 12.8559 1.14413 13.1312 1.48282 13.3038C1.86786 13.5 2.37191 13.5 3.38 13.5H14.62C15.6281 13.5 16.1321 13.5 16.5172 13.3038C16.8559 13.1312 17.1312 12.8559 17.3038 12.5172C17.5 12.1321 17.5 11.6281 17.5 10.62V7.04133C17.5 6.4778 17.5 6.19604 17.4223 5.94028C17.3536 5.71386 17.2408 5.50321 17.0906 5.3204C16.9209 5.11391 16.6864 4.95761 16.2175 4.64502L14.5 3.5"
							stroke="white"
							strokeLinecap="round"
						/>
					</svg>
					<span>Сохранить</span>
				</button>
			</div>
			<ReactCodeMirror
				className={
					'flex-1 bg-dark rounded-20 border border-gray-main overflow-auto w-full'
				}
				value={code}
				extensions={[sql()]}
				theme={githubDark}
				height={'100%'}
				onChange={(value: string) => setCode(value)}
			/>
		</div>
	)
}

export default CreateTemplateSection
