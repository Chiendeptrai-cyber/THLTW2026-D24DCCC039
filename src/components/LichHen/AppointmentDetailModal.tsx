import React from 'react';
import { Modal, Divider, Card, Row, Col, Tag } from 'antd';
import type { Appointment } from '@/types/lichhen';

interface AppointmentDetailModalProps {
	appointment: Appointment | null;
	visible: boolean;
	onClose: () => void;
	employees: any[];
	services: any[];
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
	appointment,
	visible,
	onClose,
	employees,
	services,
}) => {
	if (!appointment) return null;

	const employee = employees.find((e) => e.id === appointment.employeeId);
	const service = services.find((s) => s.id === appointment.serviceId);

	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			pending: 'Chờ duyệt',
			confirmed: 'Xác nhận',
			completed: 'Hoàn thành',
			cancelled: 'Hủy',
		};
		return labels[status] || status;
	};

	const getStatusColor = (status: string) => {
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

	return (
		<Modal title='Chi tiết Lịch hẹn' open={visible} onCancel={onClose} footer={null} width={600}>
			<Card>
				<h3>Thông tin khách hàng</h3>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<div>
							<strong>Tên:</strong> {appointment.customerName}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Điện thoại:</strong> {appointment.customerPhone}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Email:</strong> {appointment.customerEmail || '-'}
						</div>
					</Col>
				</Row>

				<Divider />

				<h3>Thông tin dịch vụ</h3>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<div>
							<strong>Nhân viên:</strong> {employee?.name || '-'}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Dịch vụ:</strong> {service?.name || '-'}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Giá:</strong>{' '}
							{service
								? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)
								: '-'}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Thời gian:</strong> {service?.duration || '-'} phút
						</div>
					</Col>
				</Row>

				<Divider />

				<h3>Thông tin lịch hẹn</h3>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<div>
							<strong>Ngày:</strong> {appointment.appointmentDate}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Giờ:</strong> {appointment.startTime}
						</div>
					</Col>
					<Col span={12}>
						<div>
							<strong>Trạng thái:</strong>{' '}
							<Tag color={getStatusColor(appointment.status)}>{getStatusLabel(appointment.status)}</Tag>
						</div>
					</Col>
				</Row>

				{appointment.notes && (
					<>
						<Divider />
						<h3>Ghi chú</h3>
						<p>{appointment.notes}</p>
					</>
				)}

				{appointment.rating && (
					<>
						<Divider />
						<h3>Đánh giá</h3>
						<div>
							<strong>Sao:</strong> {appointment.rating.rating}/5
						</div>
						{appointment.rating.comment && (
							<div style={{ marginTop: 8 }}>
								<strong>Bình luận:</strong> {appointment.rating.comment}
							</div>
						)}
						{appointment.rating.employeeResponse && (
							<div style={{ marginTop: 8 }}>
								<strong>Phản hồi NV:</strong> {appointment.rating.employeeResponse}
							</div>
						)}
					</>
				)}
			</Card>
		</Modal>
	);
};

export default AppointmentDetailModal;
