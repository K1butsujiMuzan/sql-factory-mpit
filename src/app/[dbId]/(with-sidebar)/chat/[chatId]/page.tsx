import ChatPageView from '@/components/ChatPage/ChatPageView'
import type { TSqlResult } from '@/components/ChatPage/ChatPageView'

interface Props {
	params: Promise<{ dbId: string; chatId: string }>
}

const MOCK_RESULT: TSqlResult = {
	query:
		'SELECT id, name, owner, department, status, priority, amount, currency, region, created_at FROM reports LIMIT 25;',
	title: 'Отчеты',
	table_data: {
		header: [
			'ID',
			'Название',
			'Владелец',
			'Отдел',
			'Статус',
			'Приоритет',
			'Сумма',
			'Валюта',
			'Регион',
			'Дата'
		],
		data: [
			['1', 'Ежедневный отчет', 'Иванов', 'BI', 'Готово', 'Высокий', '125000', 'RUB', 'RU', '2026-04-20'],
			['2', 'Продажи (Q1)', 'Петров', 'Sales', 'Готово', 'Средний', '98000', 'USD', 'US', '2026-04-18'],
			['3', 'Запасы склада', 'Сидорова', 'Ops', 'В процессе', 'Высокий', '43000', 'EUR', 'EU', '2026-04-16'],
			['4', 'Маркетинг', 'Кузнецов', 'Marketing', 'Готово', 'Низкий', '15000', 'USD', 'US', '2026-04-14'],
			['5', 'Финансы', 'Орлова', 'Finance', 'В процессе', 'Высокий', '770000', 'RUB', 'RU', '2026-04-12'],
			['6', 'Клиенты', 'Смирнов', 'CS', 'Готово', 'Средний', '22000', 'USD', 'US', '2026-04-10'],
			['7', 'Конверсия', 'Попова', 'Product', 'Готово', 'Средний', '31000', 'EUR', 'EU', '2026-04-08'],
			['8', 'Retention', 'Васильев', 'Product', 'В процессе', 'Высокий', '54000', 'USD', 'US', '2026-04-06'],
			['9', 'Лиды (апрель)', 'Никитина', 'Sales', 'Готово', 'Низкий', '18000', 'USD', 'US', '2026-04-05'],
			['10', 'Расходы', 'Федоров', 'Finance', 'Готово', 'Средний', '260000', 'RUB', 'RU', '2026-04-04'],
			['11', 'NPS', 'Морозова', 'CS', 'В процессе', 'Средний', '12000', 'EUR', 'EU', '2026-04-03'],
			['12', 'Воронка', 'Алексеев', 'BI', 'Готово', 'Высокий', '67000', 'USD', 'US', '2026-04-02'],
			['13', 'Сегменты', 'Михайлова', 'Marketing', 'Готово', 'Низкий', '9000', 'USD', 'US', '2026-04-01'],
			['14', 'Доставка', 'Павлов', 'Ops', 'В процессе', 'Высокий', '41000', 'EUR', 'EU', '2026-03-31'],
			['15', 'Счета', 'Семенова', 'Finance', 'Готово', 'Средний', '510000', 'RUB', 'RU', '2026-03-30']
		]
	},
	chart_type: 'bar',
	reasoning:
		'Основные команды (CRUD)\nБольшинство задач решается четырьмя базовыми операторами:\n• SELECT: Извлекает данные из таблицы.\n• INSERT: Добавляет новые строки в базу.\n• UPDATE: Обновляет существующие данные.\n• DELETE: Удаляет записи.\n\nКлючевые операторы для выборки данных\nПри использовании SELECT часто применяются дополнительные условия:\n• WHERE: Фильтрует данные по условию (например, WHERE city = "Moscow").\n• ORDER BY: Сортирует результат по возрастанию или убыванию.\n• JOIN: Объединяет данные из нескольких таблиц по общему полю.\n• GROUP BY: Группирует строки с одинаковыми значениями.'
}

export default async function ChatPage({ params }: Props) {
	await params
	return (
		<div className="chat-page-scroll">
			<ChatPageView result={MOCK_RESULT} />
			<style>{`
        .chat-page-scroll [data-chat-scroll] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .chat-page-scroll [data-chat-scroll]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
		</div>
	)
}
