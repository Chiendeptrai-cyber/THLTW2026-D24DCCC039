import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Table, Button, Popconfirm, Space, Modal, Form, Input, InputNumber, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Service } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';

interface ServiceFormData extends Omit<Service, 'id' | 'createdAt' | 'updatedAt'> {}

const DichVuPage: React.FC = () => {
	const dispatch = useDispatch();
	const { list: services, loading } = useSelector((state: any) => state.service);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch({ type: 'service/fetchList' });
	}, [dispatch]);

	const handleOpenModal = (record?: Service) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			setEditingId(null);
		}
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingId(null);
		form.resetFields();
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingId) {
				dispatch({
					type: 'service/update',
					payload: {
						id: editingId,
						data: values,
					},
				});
				message.success('Cập nhật dịch vụ thành công!');
			} else {
				dispatch({
					type: 'service/create',
					payload: {
						...values,
						isActive: true,
					},
				});
				message.success('Thêm dịch vụ thành công!');
			}

			handleCloseModal();
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin!');
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: 'service/delete',
			payload: id,
		});
		message.success('Xóa dịch vụ thành công!');
	};

	const columns: ColumnsType<Service> = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
			width: 250,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 300,
			ellipsis: true,
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'price',
			key: 'price',
			width: 150,
			render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
		},
		{
			title: 'Thời gian (phút)',
			dataIndex: 'duration',
			key: 'duration',
			width: 150,
			align: 'center',
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			key: 'category',
			width: 150,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
			key: 'isActive',
			width: 120,
			render: (isActive) => (isActive ? '✓ Hoạt động' : '✗ Vô hiệu'),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			fixed: 'right',
			width: 150,
			render: (_, record) => (
				<Space size='small'>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size='small' />
					<Popconfirm
						title='Xóa dịch vụ'
						description='Bạn có chắc chắn muốn xóa dịch vụ này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger icon={<DeleteOutlined />} size='small' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='page-container'>
			<Card
				title='Quản lý Dịch vụ'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm Dịch vụ
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={Array.isArray(services) ? services : []}
					loading={loading}
					rowKey='id'
					pagination={{
						pageSize: 10,
						total: Array.isArray(services) ? services.length : 0,
						showSizeChanger: true,
					}}
					scroll={{ x: 1400 }}
				/>
			</Card>

			<Modal
				title={editingId ? 'Cập nhật Dịch vụ' : 'Thêm Dịch vụ'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={handleCloseModal}
				width={600}
				destroyOnClose
				zIndex={9999}
				centered
			>
				<Form form={form} layout='vertical' autoComplete='off'>
					<Form.Item
						name='name'
						label='Tên dịch vụ'
						rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
					>
						<Input placeholder='Ví dụ: Cắt tóc nam, Massage mặt' />
					</Form.Item>

					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea placeholder='Mô tả chi tiết về dịch vụ' rows={3} />
					</Form.Item>

					<Form.Item name='category' label='Danh mục'>
						<Input placeholder='Ví dụ: Cắt tóc, Spa, Y tế' />
					</Form.Item>

					<Form.Item name='price' label='Giá (VNĐ)' rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}>
						<InputNumber
							min={0}
							step={10000}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
						/>
					</Form.Item>

					<Form.Item
						name='duration'
						label='Thời gian thực hiện (phút)'
						rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
					>
						<InputNumber min={5} step={5} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DichVuPage;
