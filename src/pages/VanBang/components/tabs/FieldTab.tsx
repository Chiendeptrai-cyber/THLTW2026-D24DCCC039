import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { FIELD_TYPE_LABEL } from '../../constants';
import type { TemplateField } from '../../types';

interface FieldTabProps {
	fields: TemplateField[];
	onOpenCreate: () => void;
	onEdit: (record: TemplateField) => void;
	onDelete: (record: TemplateField) => void;
}

const FieldTab: React.FC<FieldTabProps> = ({ fields, onOpenCreate, onEdit, onDelete }) => {
	const columns: ColumnsType<TemplateField> = [
		{
			title: 'Tên trường',
			dataIndex: 'name',
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'type',
			render: (value: TemplateField['type']) => <Tag>{FIELD_TYPE_LABEL[value]}</Tag>,
			width: 150,
		},
		{
			title: 'Thao tác',
			width: 120,
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} type='link' onClick={() => onEdit(record)} />
					<Popconfirm
						title='Xóa trường này? Dữ liệu liên quan trong văn bằng sẽ bị loại bỏ.'
						onConfirm={() => onDelete(record)}
					>
						<Button danger icon={<DeleteOutlined />} type='link' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Button type='primary' icon={<PlusOutlined />} onClick={onOpenCreate}>
				Thêm trường
			</Button>
			<Divider />
			<Table rowKey='id' dataSource={fields} columns={columns} pagination={false} />
		</Card>
	);
};

export default FieldTab;
