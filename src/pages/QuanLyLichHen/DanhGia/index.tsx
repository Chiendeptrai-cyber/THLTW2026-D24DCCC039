import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Rate, message, Card, Space, Tag, Avatar } from 'antd';
import { RatingService, AppointmentService } from '@/services/QuanLyLichHen';
import type { Rating } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const DanhGiaPage: React.FC = () => {
	const [ratings, setRatings] = useState<Rating[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [employees, setEmployees] = useState<any[]>([]);
	const [appointments, setAppointments] = useState<any[]>([]);

	useEffect(() => {
		fetchRatings();
		fetchEmployees();
		fetchAppointments();
	}, []);

	const fetchRatings = async () => {
		setLoading(true);
		try {
			const response = await RatingService.getList();
			setRatings(response || []);
		} catch (error) {
			message.error('Lỗi khi lấy danh sách đánh giá!');
		} finally {
			setLoading(false);
		}
	};

	const fetchEmployees = async () => {
		try {
			const response = await fetch('/api/appointment-management/employees');
			const data = await response.json();
			setEmployees(Array.isArray(data) ? data : data?.data || []);
		} catch (error) {
			console.error('Lỗi khi lấy danh sách nhân viên:', error);
			setEmployees([]);
		}
	};

	const fetchAppointments = async () => {
		try {
			const response = await AppointmentService.getList({ status: 'completed' });
			setAppointments(Array.isArray(response) ? response : response.data || []);
		} catch (error) {
			console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
		}
	};

	const handleOpenModal = (record?: Rating) => {
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
				await RatingService.update(editingId, values);
				message.success('Cập nhật đánh giá thành công!');
			} else {
				await RatingService.create(values);
				message.success('Thêm đánh giá thành công!');
			}

			fetchRatings();
			handleCloseModal();
		} catch (error) {
			message.error('Lỗi khi lưu đánh giá!');
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await RatingService.delete(id);
			message.success('Xóa đánh giá thành công!');
			fetchRatings();
		} catch (error) {
			message.error('Lỗi khi xóa đánh giá!');
		}
	};

	const columns: ColumnsType<Rating> = [
		{
			title: 'Nhân viên',
			dataIndex: 'employeeId',
			key: 'employeeId',
			width: 150,
			render: (employeeId) => employees.find((e) => e.id === employeeId)?.name || '-',
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerId',
			key: 'customerId',
			width: 150,
			render: (customerId) => appointments.find((a) => a.customerId === customerId)?.customerName || '-',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			width: 150,
			render: (rating) => <Rate value={rating} disabled />,
		},
		{
			title: 'Bình luận',
			dataIndex: 'comment',
			key: 'comment',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Phản hồi NV',
			dataIndex: 'employeeResponse',
			key: 'employeeResponse',
			width: 250,
			ellipsis: true,
			render: (response) => (response ? <Tag color='blue'>{response}</Tag> : '-'),
		},
		{
			title: 'Ngày đánh giá',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (date) => dayjs(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			fixed: 'right',
			width: 150,
			render: (_, record) => (
				<Space size='small'>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size='small' />
					<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size='small' />
				</Space>
			),
		},
	];

	return (
		<div className='page-container'>
			<Card title='Quản lý Đánh giá & Nhận xét'>
				<Table
					columns={columns}
					dataSource={Array.isArray(ratings) ? ratings : []}
					loading={loading}
					rowKey='id'
					pagination={{
						pageSize: 10,
						total: Array.isArray(ratings) ? ratings.length : 0,
						showSizeChanger: true,
					}}
					scroll={{ x: 1400 }}
				/>
			</Card>

			<Modal
				title={editingId ? 'Cập nhật Đánh giá' : 'Thêm Đánh giá'}
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
						name='appointmentId'
						label='Chọn lịch hẹn'
						rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn!' }]}
					>
						<select>
							{Array.isArray(appointments) && appointments.length > 0 ? (
								appointments.map((apt) => (
									<option key={apt.id} value={apt.id}>
										{apt.customerName} - {apt.appointmentDate} (
										{Array.isArray(employees) && employees.find((e) => e.id === apt.employeeId)?.name})
									</option>
								))
							) : (
								<option>Không có lịch hẹn nào</option>
							)}
						</select>
					</Form.Item>

					<Form.Item
						name='rating'
						label='Đánh giá (sao)'
						rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
					>
						<Rate />
					</Form.Item>

					<Form.Item name='comment' label='Bình luận'>
						<Input.TextArea placeholder='Nhập bình luận của bạn' rows={4} />
					</Form.Item>

					{editingId && (
						<Form.Item name='employeeResponse' label='Phản hồi từ nhân viên'>
							<Input.TextArea placeholder='Nhân viên phản hồi tại đây...' rows={3} />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default DanhGiaPage;
