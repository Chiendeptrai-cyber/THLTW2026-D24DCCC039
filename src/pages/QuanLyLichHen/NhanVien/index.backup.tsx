import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import {
	Table,
	Button,
	Popconfirm,
	Space,
	Modal,
	Form,
	Input,
	InputNumber,
	message,
	Card,
	Row,
	Col,
	Tabs,
	TimeRangePickerLocale,
	Alert,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Employee, WorkSchedule } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';

interface EmployeeFormData extends Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> {}

const NhanVienPage: React.FC = () => {
	const dispatch = useDispatch();
	const employeeState = useSelector((state: any) => state.employee);
	const employees = employeeState?.list || [];
	const loading = employeeState?.loading || false;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch({ type: 'employee/fetchList' });
	}, [dispatch]);

	const handleOpenModal = (record?: Employee) => {
		console.log('=== handleOpenModal called ===');
		console.log('record:', record);
		console.log('Current isModalVisible:', isModalVisible);
		
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			setEditingId(null);
		}
		
		setIsModalVisible(true);
		console.log('=== State should be updated, isModalVisible is now:', true);
		return;
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
					type: 'employee/update',
					payload: {
						id: editingId,
						data: values,
					},
				});
				message.success('Cập nhật nhân viên thành công!');
			} else {
				dispatch({
					type: 'employee/create',
					payload: values,
				});
				message.success('Thêm nhân viên thành công!');
			}

			handleCloseModal();
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin!');
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: 'employee/delete',
			payload: id,
		});
		message.success('Xóa nhân viên thành công!');
	};

	const columns: ColumnsType<Employee> = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
			width: 200,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: 220,
		},
		{
			title: 'Điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			width: 150,
		},
		{
			title: 'Chức vụ',
			dataIndex: 'position',
			key: 'position',
			width: 150,
		},
		{
			title: 'Max khách/ngày',
			dataIndex: 'maxCustomersPerDay',
			key: 'maxCustomersPerDay',
			width: 120,
			align: 'center',
		},
		{
			title: 'Đánh giá trung bình',
			dataIndex: 'averageRating',
			key: 'averageRating',
			width: 150,
			render: (rating) => (rating ? `${rating.toFixed(1)}/5` : 'Chưa có'),
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
						title='Xóa nhân viên'
						description='Bạn có chắc chắn muốn xóa nhân viên này?'
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
			{isModalVisible && (
				<Alert
					message='MODAL STATE IS ACTIVE - This proves the state is updating!'
					type='success'
					closable
					style={{ marginBottom: 16 }}
				/>
			)}
			<Card
				title='Quản lý Nhân viên'
				extra={
					<Button 
						type='primary' 
						icon={<PlusOutlined />} 
						onClick={() => {
							console.log('Button clicked, setting modal visible');
							handleOpenModal();
						}}
					>
						Thêm Nhân viên
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={Array.isArray(employees) ? employees : []}
					loading={loading}
					rowKey='id'
					pagination={{
						pageSize: 10,
						total: Array.isArray(employees) ? employees.length : 0,
						showSizeChanger: true,
					}}
					scroll={{ x: 1200 }}
				/>
			</Card>

			<Modal
				title={editingId ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={handleCloseModal}
				width={600}
				destroyOnClose
				centered
			>
				<Form form={form} layout='vertical' autoComplete='off'>
					<Form.Item
						name='name'
						label='Tên nhân viên'
						rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
					>
						<Input placeholder='Nhập tên nhân viên' />
					</Form.Item>

					<Form.Item
						name='email'
						label='Email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' },
						]}
					>
						<Input placeholder='Nhập email' type='email' />
					</Form.Item>

					<Form.Item
						name='phone'
						label='Điện thoại'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>

					<Form.Item name='position' label='Chức vụ' rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}>
						<Input placeholder='Ví dụ: Thợ cắt tóc, Spa therapist' />
					</Form.Item>

					<Form.Item
						name='maxCustomersPerDay'
						label='Số khách tối đa/ngày'
						rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
					>
						<InputNumber min={1} max={20} placeholder='Nhập số khách' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default NhanVienPage;
