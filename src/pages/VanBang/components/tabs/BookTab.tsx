import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, InputNumber, Table } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import type { DiplomaBook, DiplomaInfo } from '../../types';

interface BookTabProps {
	books: DiplomaBook[];
	diplomas: DiplomaInfo[];
	bookForm: FormInstance;
	onCreateBook: () => Promise<void>;
	getNextEntryNumber: (bookId: string, ignoredDiplomaId?: string) => number;
}

const BookTab: React.FC<BookTabProps> = ({ books, diplomas, bookForm, onCreateBook, getNextEntryNumber }) => {
	const columns: ColumnsType<DiplomaBook> = [
		{
			title: 'Năm sổ',
			dataIndex: 'year',
			width: 150,
		},
		{
			title: 'Ngày mở sổ',
			dataIndex: 'createdAt',
			render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: 'Số văn bằng đã ghi',
			render: (_, record) => diplomas.filter((item) => item.bookId === record.id).length,
		},
		{
			title: 'Số vào sổ kế tiếp',
			render: (_, record) => getNextEntryNumber(record.id),
		},
	];

	return (
		<Card>
			<Form form={bookForm} layout='inline' onFinish={onCreateBook}>
				<Form.Item label='Năm mở sổ' name='year' rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
					<InputNumber min={2000} max={2100} precision={0} style={{ width: 140 }} />
				</Form.Item>
				<Form.Item>
					<Button htmlType='submit' type='primary' icon={<PlusOutlined />}>
						Mở sổ mới
					</Button>
				</Form.Item>
			</Form>
			<Divider />
			<Table rowKey='id' pagination={false} dataSource={[...books].sort((a, b) => b.year - a.year)} columns={columns} />
		</Card>
	);
};

export default BookTab;
