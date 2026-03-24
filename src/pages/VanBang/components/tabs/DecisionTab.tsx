import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import type { DiplomaBook, GraduationDecision } from '../../types';

const { Text } = Typography;

interface DecisionTabProps {
	decisions: GraduationDecision[];
	books: DiplomaBook[];
	onOpenCreate: () => void;
	onEdit: (record: GraduationDecision) => void;
	onDelete: (record: GraduationDecision) => void;
	getBookById: (bookId: string) => DiplomaBook | undefined;
}

const DecisionTab: React.FC<DecisionTabProps> = ({ decisions, books, onOpenCreate, onEdit, onDelete, getBookById }) => {
	const columns: ColumnsType<GraduationDecision> = [
		{
			title: 'Số quyết định',
			dataIndex: 'decisionNumber',
			width: 160,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'issueDate',
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
			width: 140,
		},
		{
			title: 'Trích yếu',
			dataIndex: 'summary',
		},
		{
			title: 'Sổ văn bằng',
			render: (_, record) => `Năm ${getBookById(record.bookId)?.year || '-'}`,
			width: 150,
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'lookupCount',
			width: 120,
		},
		{
			title: 'Thao tác',
			width: 120,
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} type='link' onClick={() => onEdit(record)} />
					<Popconfirm title='Xóa quyết định này?' onConfirm={() => onDelete(record)}>
						<Button danger icon={<DeleteOutlined />} type='link' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Button type='primary' icon={<PlusOutlined />} disabled={!books.length} onClick={onOpenCreate}>
				Thêm quyết định
			</Button>
			{!books.length && <Text type='secondary'> Hãy tạo sổ văn bằng trước.</Text>}
			<Divider />
			<Table rowKey='id' dataSource={decisions} columns={columns} pagination={{ pageSize: 10 }} />
		</Card>
	);
};

export default DecisionTab;
