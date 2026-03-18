import React, { useEffect, useState } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Rate,
	message,
	Card,
	Space,
	Tag,
	Avatar,
	Divider,
	Comment,
	List,
	Empty,
} from 'antd';
import { RatingService, AppointmentService } from '@/services/QuanLyLichHen';
import type { Rating } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';

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
			{/* Comments Feed Section */}
			<Card
				title='💬 Bình luận gần đây'
				style={{ marginBottom: 24 }}
				extra={
					<Button type='primary' onClick={() => handleOpenModal()}>
						Viết đánh giá
					</Button>
				}
			>
				{Array.isArray(ratings) && ratings.length > 0 ? (
					<List
						dataSource={ratings
							.slice(0, 5)
							.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())}
						renderItem={(item) => (
							<List.Item key={item.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
								<List.Item.Meta
									avatar={<Avatar>{employees.find((e) => e.id === item.employeeId)?.name?.charAt(0)}</Avatar>}
									title={
										<div>
											<strong>
												{appointments.find((a) => a.id === item.appointmentId)?.customerName || 'Khách hàng'}
											</strong>
											<Rate value={item.rating} disabled style={{ marginLeft: 12, fontSize: 14 }} />
										</div>
									}
									description={
										<div style={{ marginTop: 8 }}>
											<p style={{ margin: '8px 0', color: '#595959' }}>{item.comment}</p>
											{item.employeeResponse && (
												<div
													style={{
														marginTop: 8,
														padding: '8px',
														backgroundColor: '#fafafa',
														borderLeft: '3px solid #1890ff',
													}}
												>
													<strong style={{ color: '#1890ff' }}>
														Phản hồi từ {employees.find((e) => e.id === item.employeeId)?.name}:
													</strong>
													<p style={{ margin: '8px 0', color: '#595959' }}>{item.employeeResponse}</p>
												</div>
											)}
											<small style={{ color: '#8c8c8c' }}>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</small>
										</div>
									}
								/>
								<Space>
									<Button type='text' size='small' icon={<EditOutlined />} onClick={() => handleOpenModal(item)} />
									<Button
										type='text'
										danger
										size='small'
										icon={<DeleteOutlined />}
										onClick={() => handleDelete(item.id)}
									/>
								</Space>
							</List.Item>
						)}
					/>
				) : (
					<Empty description='Chưa có bình luận nào' />
				)}
			</Card>

			<Divider />

			{/* Ratings Table */}
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
				title={editingId ? 'Cập nhật Đánh giá' : 'Thêm Đánh giá mới'}
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
						<select style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}>
							<option value=''>-- Chọn lịch hẹn --</option>
							{Array.isArray(appointments) && appointments.length > 0 ? (
								appointments.map((apt) => (
									<option key={apt.id} value={apt.id}>
										{apt.customerName} - {apt.appointmentDate} ({employees.find((e) => e.id === apt.employeeId)?.name})
									</option>
								))
							) : (
								<option disabled>Không có lịch hẹn hoàn thành</option>
							)}
						</select>
					</Form.Item>

					<Form.Item
						name='rating'
						label='Đánh giá (sao)'
						rules={[{ required: true, message: 'Vui lòng chọn mức đánh giá!' }]}
					>
						<Rate allowHalf tooltips={['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']} />
					</Form.Item>

					<Form.Item
						name='comment'
						label='Bình luận của bạn'
						rules={[{ required: !editingId, message: 'Vui lòng nhập bình luận!' }]}
					>
						<Input.TextArea placeholder='Chia sẻ trải nghiệm của bạn...' rows={4} maxLength={500} showCount />
					</Form.Item>

					{editingId && (
						<Form.Item name='employeeResponse' label='💬 Phản hồi từ nhân viên'>
							<Input.TextArea placeholder='Nhân viên sẽ phản hồi tại đây...' rows={3} disabled={!editingId} />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default DanhGiaPage;
