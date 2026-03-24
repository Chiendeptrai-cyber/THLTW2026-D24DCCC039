import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import type { DiplomaInfo, GraduationDecision } from '../../types';

const { Text } = Typography;

interface DiplomaTabProps {
	diplomas: DiplomaInfo[];
	decisions: GraduationDecision[];
	onOpenCreate: () => void;
	onEdit: (record: DiplomaInfo) => void;
	onDelete: (record: DiplomaInfo) => void;
	getDecisionById: (decisionId: string) => GraduationDecision | undefined;
}

const DiplomaTab: React.FC<DiplomaTabProps> = ({
	diplomas,
	decisions,
	onOpenCreate,
	onEdit,
	onDelete,
	getDecisionById,
}) => {
	const columns: ColumnsType<DiplomaInfo> = [
		{
			title: 'Số vào sổ',
			dataIndex: 'entryNumber',
			width: 100,
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'diplomaNumber',
			width: 180,
		},
		{
			title: 'MSV',
			dataIndex: 'studentCode',
			width: 120,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			width: 220,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'birthDate',
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Quyết định',
			render: (_, record) => getDecisionById(record.decisionId)?.decisionNumber || '-',
			width: 150,
		},
		{
			title: 'Thao tác',
			width: 120,
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} type='link' onClick={() => onEdit(record)} />
					<Popconfirm title='Xóa thông tin văn bằng này?' onConfirm={() => onDelete(record)}>
						<Button danger icon={<DeleteOutlined />} type='link' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Button type='primary' icon={<PlusOutlined />} disabled={!decisions.length} onClick={onOpenCreate}>
				Thêm văn bằng
			</Button>
			{!decisions.length && <Text type='secondary'> Hãy tạo quyết định tốt nghiệp trước.</Text>}
			<Divider />
			<Table rowKey='id' dataSource={diplomas} columns={columns} pagination={{ pageSize: 10 }} />
		</Card>
	);
};

export default DiplomaTab;
