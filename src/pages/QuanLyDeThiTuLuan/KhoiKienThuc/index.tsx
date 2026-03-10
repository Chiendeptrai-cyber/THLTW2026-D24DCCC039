import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { KnowledgeBlock } from '@/types/exam';

const KhoiKienThuc: React.FC = () => {
	const [blocks, setBlocks] = useState<KnowledgeBlock[]>([
		{
			id: '1',
			name: 'Tổng quan',
			description: 'Kiến thức cơ bản và tổng quan về môn học',
			createdAt: new Date().toISOString(),
		},
		{
			id: '2',
			name: 'Chuyên sâu',
			description: 'Kiến thức chuyên sâu và nâng cao',
			createdAt: new Date().toISOString(),
		},
	]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingBlock, setEditingBlock] = useState<KnowledgeBlock | null>(null);
	const [form] = Form.useForm();

	const handleAddBlock = () => {
		setEditingBlock(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEditBlock = (block: KnowledgeBlock) => {
		setEditingBlock(block);
		form.setFieldsValue({
			name: block.name,
			description: block.description,
		});
		setIsModalVisible(true);
	};

	const handleDeleteBlock = (id: string) => {
		setBlocks(blocks.filter((b) => b.id !== id));
		message.success('Xóa khối kiến thức thành công');
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (editingBlock) {
				setBlocks(
					blocks.map((b) =>
						b.id === editingBlock.id
							? {
									...b,
									name: values.name,
									description: values.description,
							  }
							: b,
					),
				);
				message.success('Cập nhật khối kiến thức thành công');
			} else {
				const newBlock: KnowledgeBlock = {
					id: Date.now().toString(),
					name: values.name,
					description: values.description,
					createdAt: new Date().toISOString(),
				};
				setBlocks([...blocks, newBlock]);
				message.success('Thêm khối kiến thức thành công');
			}
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const columns = [
		{
			title: 'STT',
			width: 60,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			render: (_text: any, record: KnowledgeBlock) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEditBlock(record)} />
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn có chắc chắn muốn xóa khối kiến thức này?'
						onConfirm={() => handleDeleteBlock(record.id)}
					>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<div style={{ marginBottom: 20 }}>
				<h2>Quản lý khối kiến thức</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAddBlock}>
					Thêm khối kiến thức
				</Button>
			</div>

			<Table dataSource={blocks} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingBlock ? 'Chỉnh sửa khối kiến thức' : 'Thêm khối kiến thức'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Tên khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức' }]}
					>
						<Input placeholder='VD: Tổng quan, Chuyên sâu' />
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea placeholder='Mô tả về khối kiến thức' rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default KhoiKienThuc;
