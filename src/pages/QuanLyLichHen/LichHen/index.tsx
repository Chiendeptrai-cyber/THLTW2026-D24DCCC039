import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import {
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	TimePicker,
	message,
	Card,
	Tag,
	Popconfirm,
	Drawer,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	CheckOutlined,
	CloseOutlined,
} from '@ant-design/icons';
import type { Appointment, AppointmentStatus } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const LichHenPage: React.FC = () => {
	const dispatch = useDispatch();
	const appointments = useSelector((state: any) => state.appointment?.list || []);
	const employees = useSelector((state: any) => state.employee?.list || []);
	const services = useSelector((state: any) => state.service?.list || []);
	const loading = useSelector((state: any) => state.appointment?.loading || false);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch({ type: 'appointment/fetchList' });
		dispatch({ type: 'employee/fetchList' });
		dispatch({ type: 'service/fetchList' });
	}, [dispatch]);

	const handleOpenModal = (record?: Appointment) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				...record,
				appointmentDate: dayjs(record.appointmentDate),
				startTime: dayjs(record.startTime, 'HH:mm'),
			});
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
			const appointmentDate = values.appointmentDate.format('YYYY-MM-DD');
			const startTime = values.startTime.format('HH:mm');

			// Kiểm tra trùng lịch
			const conflictCheck = await dispatch({
				type: 'appointment/checkConflict',
				payload: {
					employeeId: values.employeeId,
					appointmentDate,
					startTime,
					duration: services.find((s: any) => s.id === values.serviceId)?.duration || 30,
				},
			});

			if (conflictCheck?.hasConflict && !editingId) {
				message.error('Thời gian đã được đặt! Vui lòng chọn thời gian khác.');
				return;
			}

			const payload = {
				...values,
				appointmentDate,
				startTime,
				status: editingId ? values.status : 'pending',
			};

			if (editingId) {
				dispatch({
					type: 'appointment/update',
					payload: { id: editingId, data: payload },
				});
				message.success('Cập nhật lịch hẹn thành công!');
			} else {
				dispatch({
					type: 'appointment/create',
					payload,
				});
				message.success('Đặt lịch hẹn thành công!');
			}

			handleCloseModal();
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin!');
		}
	};

	const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
		dispatch({
			type: 'appointment/updateStatus',
			payload: { id, status: newStatus },
		});
		message.success('Cập nhật trạng thái thành công!');
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: 'appointment/delete',
			payload: id,
		});
		message.success('Xóa lịch hẹn thành công!');
	};

	const getStatusColor = (status: AppointmentStatus) => {
		switch (status) {
			case 'pending':
				return 'orange';
			case 'confirmed':
				return 'blue';
			case 'completed':
				return 'green';
			case 'cancelled':
				return 'red';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: AppointmentStatus) => {
		switch (status) {
			case 'pending':
				return 'Chờ duyệt';
			case 'confirmed':
				return 'Xác nhận';
			case 'completed':
				return 'Hoàn thành';
			case 'cancelled':
				return 'Hủy';
			default:
				return status;
		}
	};

	const columns: ColumnsType<Appointment> = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 150,
		},
		{
			title: 'Điện thoại',
			dataIndex: 'customerPhone',
			key: 'customerPhone',
			width: 120,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'employeeId',
			key: 'employeeId',
			width: 150,
			render: (employeeId) => employees.find((e: any) => e.id === employeeId)?.name || '-',
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			key: 'serviceId',
			width: 150,
			render: (serviceId) => services.find((s: any) => s.id === serviceId)?.name || '-',
		},
		{
			title: 'Ngày',
			dataIndex: 'appointmentDate',
			key: 'appointmentDate',
			width: 120,
			render: (date) => dayjs(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Giờ',
			dataIndex: 'startTime',
			key: 'startTime',
			width: 80,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: AppointmentStatus) => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			fixed: 'right',
			width: 200,
			render: (_, record) => (
				<Space size='small'>
					<Button
						type='primary'
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedAppointment(record);
							setDetailDrawerVisible(true);
						}}
						size='small'
					/>
					{record.status !== 'completed' && record.status !== 'cancelled' && (
						<>
							<Button size='small' onClick={() => handleOpenModal(record)} icon={<EditOutlined />} />
							<Popconfirm
								title='Xóa lịch hẹn'
								description='Bạn có chắc chắn muốn xóa?'
								onConfirm={() => handleDelete(record.id)}
								okText='Có'
								cancelText='Không'
							>
								<Button danger icon={<DeleteOutlined />} size='small' />
							</Popconfirm>
						</>
					)}
				</Space>
			),
		},
	];

	return (
		<div className='page-container'>
			<Card
				title='Quản lý Lịch hẹn'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Đặt Lịch hẹn mới
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={appointments}
					loading={loading}
					rowKey='id'
					pagination={{
						pageSize: 10,
						total: appointments.length,
						showSizeChanger: true,
					}}
					scroll={{ x: 1400 }}
				/>
			</Card>

			{/* Modal Thêm/Sửa Lịch hẹn */}
			<Modal
				title={editingId ? 'Cập nhật Lịch hẹn' : 'Đặt Lịch hẹn mới'}
				open={isModalVisible}
				onOk={handleSubmit}
				onCancel={handleCloseModal}
				width={700}
			>
				<Form form={form} layout='vertical' autoComplete='off'>
					<Form.Item
						name='customerName'
						label='Tên khách hàng'
						rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
					>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>

					<Form.Item
						name='customerPhone'
						label='Số điện thoại'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>

					<Form.Item name='customerEmail' label='Email'>
						<Input type='email' placeholder='Nhập email' />
					</Form.Item>

					<Form.Item
						name='employeeId'
						label='Chọn nhân viên'
						rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
					>
						<Select placeholder='Chọn nhân viên'>
							{employees.map((emp: any) => (
								<Select.Option key={emp.id} value={emp.id}>
									{emp.name} ({emp.position})
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='serviceId'
						label='Chọn dịch vụ'
						rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
					>
						<Select placeholder='Chọn dịch vụ'>
							{services.map((svc: any) => (
								<Select.Option key={svc.id} value={svc.id}>
									{svc.name} -{' '}
									{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(svc.price)}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='appointmentDate'
						label='Ngày hẹn'
						rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
					>
						<DatePicker format='DD/MM/YYYY' />
					</Form.Item>

					<Form.Item name='startTime' label='Giờ hẹn' rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}>
						<TimePicker format='HH:mm' />
					</Form.Item>

					<Form.Item name='notes' label='Ghi chú'>
						<Input.TextArea placeholder='Số điểm/yêu cầu đặc biệt' rows={3} />
					</Form.Item>

					{editingId && (
						<Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
							<Select>
								<Select.Option value='pending'>Chờ duyệt</Select.Option>
								<Select.Option value='confirmed'>Xác nhận</Select.Option>
								<Select.Option value='completed'>Hoàn thành</Select.Option>
								<Select.Option value='cancelled'>Hủy</Select.Option>
							</Select>
						</Form.Item>
					)}
				</Form>
			</Modal>

			{/* Drawer Chi tiết Lịch hẹn */}
			<Drawer
				title='Chi tiết Lịch hẹn'
				onClose={() => setDetailDrawerVisible(false)}
				open={detailDrawerVisible}
				width={500}
			>
				{selectedAppointment && (
					<div className='appointment-detail'>
						<div className='detail-item'>
							<strong>Khách hàng:</strong> {selectedAppointment.customerName}
						</div>
						<div className='detail-item'>
							<strong>Điện thoại:</strong> {selectedAppointment.customerPhone}
						</div>
						<div className='detail-item'>
							<strong>Email:</strong> {selectedAppointment.customerEmail || '-'}
						</div>
						<div className='detail-item'>
							<strong>Nhân viên:</strong>{' '}
							{employees.find((e: any) => e.id === selectedAppointment.employeeId)?.name || '-'}
						</div>
						<div className='detail-item'>
							<strong>Dịch vụ:</strong> {services.find((s: any) => s.id === selectedAppointment.serviceId)?.name || '-'}
						</div>
						<div className='detail-item'>
							<strong>Ngày:</strong> {dayjs(selectedAppointment.appointmentDate).format('DD/MM/YYYY')}
						</div>
						<div className='detail-item'>
							<strong>Giờ:</strong> {selectedAppointment.startTime}
						</div>
						<div className='detail-item'>
							<strong>Trạng thái:</strong>{' '}
							<Tag color={getStatusColor(selectedAppointment.status)}>{getStatusLabel(selectedAppointment.status)}</Tag>
						</div>
						<div className='detail-item'>
							<strong>Ghi chú:</strong> {selectedAppointment.notes || '-'}
						</div>

						{selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
							<div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
								{selectedAppointment.status === 'pending' && (
									<Button
										type='primary'
										icon={<CheckOutlined />}
										onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
									>
										Xác nhận
									</Button>
								)}
								{selectedAppointment.status === 'confirmed' && (
									<Button
										type='primary'
										icon={<CheckOutlined />}
										onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
									>
										Hoàn thành
									</Button>
								)}
								<Button
									danger
									icon={<CloseOutlined />}
									onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
								>
									Hủy
								</Button>
							</div>
						)}
					</div>
				)}
			</Drawer>
		</div>
	);
};

export default LichHenPage;
