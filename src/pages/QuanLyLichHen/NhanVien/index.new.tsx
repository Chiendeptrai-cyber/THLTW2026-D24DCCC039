import React, { useState } from 'react';
import { Button, Modal, Form, Input, Card, Table, Space, Popconfirm, message, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useEffect } from 'react';
import type { Employee } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';

const NhanVienPageNew: React.FC = () => {
	// STATE
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	
	// REDUX
	const dispatch = useDispatch();
	const employees = useSelector((state: any) => state?.employee?.list || []);
	const loading = useSelector((state: any) => state?.employee?.loading || false);

	// LOAD DATA
	useEffect(() => {
		console.log('Component mounted, fetching employees');
		dispatch({ type: 'employee/fetchList' });
	}, [dispatch]);

	// HANDLERS
	const openModal = () => {
		console.log('OPEN MODAL CALLED');
		setIsModalVisible(true);
	};

	const closeModal = () => {
		console.log('CLOSE MODAL CALLED');
		setIsModalVisible(false);
		setEditingId(null);
		form.resetFields();
	};

	const editEmployee = (record: Employee) => {
		console.log('EDIT EMPLOYEE CALLED', record);
		setEditingId(record.id);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editingId) {
				dispatch({ type: 'employee/update', payload: { id: editingId, data: values } });
				message.success('Cập nhật thành công!');
			} else {
				dispatch({ type: 'employee/create', payload: values });
				message.success('Thêm thành công!');
			}
			closeModal();
		} catch (e) {
			message.error('Lỗi!');
		}
	};

	const deleteEmployee = (id: string) => {
		dispatch({ type: 'employee/delete', payload: id });
		message.success('Xóa thành công!');
	};

	// TABLE COLUMNS
	const columns: ColumnsType<Employee> = [
		{ title: 'Tên', dataIndex: 'name', key: 'name' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'Phone', dataIndex: 'phone', key: 'phone' },
		{ title: 'Position', dataIndex: 'position', key: 'position' },
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button size='small' onClick={() => editEmployee(record)}>
						Edit
					</Button>
					<Popconfirm onConfirm={() => deleteEmployee(record.id)} title='Delete?'>
						<Button danger size='small'>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='page-container'>
			<Card
				title='Nhân Viên'
				extra={
					<Button type='primary' onClick={openModal} icon={<PlusOutlined />}>
						Thêm
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={Array.isArray(employees) ? employees : []}
					loading={loading}
					rowKey='id'
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<Modal visible={isModalVisible} onOk={handleSubmit} onCancel={closeModal} title='Nhân Viên'>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='phone' label='Phone' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='position' label='Position' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='maxCustomersPerDay' label='Max/Day' rules={[{ required: true }]}>
						<InputNumber min={1} max={20} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default NhanVienPageNew;
