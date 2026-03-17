import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Spin, message, Empty } from 'antd';
import { CalendarOutlined, TeamOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { AppointmentService, StatisticsService } from '@/services/QuanLyLichHen';

const QuanLyLichHenIndex: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [statistics, setStatistics] = useState<any>(null);

	useEffect(() => {
		fetchStatistics();
	}, []);

	const fetchStatistics = async () => {
		setLoading(true);
		try {
			const stats = await StatisticsService.getOverallStatistics();
			setStatistics(stats);
		} catch (error) {
			message.error('Lỗi khi tải thống kê!');
		} finally {
			setLoading(false);
		}
	};

	const navigateTo = (path: string) => {
		history.push(path);
	};

	return (
		<div className='page-container' style={{ padding: '24px' }}>
			<Spin spinning={loading}>
				<Card
					title='Hệ thống Quản lý Lịch hẹn'
					extra={
						<Button type='primary' onClick={fetchStatistics}>
							Làm mới
						</Button>
					}
				>
					{/* Statistics Cards */}
					<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
						<Col xs={24} sm={12} md={6}>
							<Card hoverable onClick={() => navigateTo('/quan-ly-lich-hen/lich-hen')} style={{ cursor: 'pointer' }}>
								<Statistic
									title='Tổng Lịch hẹn'
									value={statistics?.totalAppointments || 0}
									prefix={<CalendarOutlined />}
									valueStyle={{ color: '#1890ff' }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card hoverable onClick={() => navigateTo('/quan-ly-lich-hen/nhan-vien')} style={{ cursor: 'pointer' }}>
								<Statistic title='Nhân viên' value='N/A' prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card hoverable onClick={() => navigateTo('/quan-ly-lich-hen/lich-hen')} style={{ cursor: 'pointer' }}>
								<Statistic
									title='Hoàn thành'
									value={statistics?.completedAppointments || 0}
									prefix={<CheckCircleOutlined />}
									valueStyle={{ color: '#faad14' }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card hoverable onClick={() => navigateTo('/quan-ly-lich-hen/thong-ke')} style={{ cursor: 'pointer' }}>
								<Statistic
									title='Tổng doanh thu'
									value={statistics?.revenueTotal || 0}
									prefix={<DollarOutlined />}
									valueStyle={{ color: '#f5222d' }}
									suffix='VNĐ'
									precision={0}
									formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value as number)}`}
								/>
							</Card>
						</Col>
					</Row>

					{/* Menu Cards */}
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Card
								title='Quản lý Nhân viên'
								hoverable
								onClick={() => navigateTo('/quan-ly-lich-hen/nhan-vien')}
								style={{ cursor: 'pointer', minHeight: 200 }}
							>
								<p>Thêm, sửa, xóa nhân viên</p>
								<p>Quản lý lịch làm việc</p>
								<p>Giới hạn khách/ngày</p>
								<Button type='primary' block>
									Quản lý
								</Button>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card
								title='Quản lý Dịch vụ'
								hoverable
								onClick={() => navigateTo('/quan-ly-lich-hen/dich-vu')}
								style={{ cursor: 'pointer', minHeight: 200 }}
							>
								<p>Thêm, sửa, xóa dịch vụ</p>
								<p>Quản lý giá và thời gian</p>
								<p>Phân loại dịch vụ</p>
								<Button type='primary' block>
									Quản lý
								</Button>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card
								title='Quản lý Lịch hẹn'
								hoverable
								onClick={() => navigateTo('/quan-ly-lich-hen/lich-hen')}
								style={{ cursor: 'pointer', minHeight: 200 }}
							>
								<p>Đặt lịch hẹn mới</p>
								<p>Kiểm tra trùng lịch</p>
								<p>Cập nhật trạng thái</p>
								<Button type='primary' block>
									Quản lý
								</Button>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card
								title='Liên hệ & Đánh giá'
								hoverable
								onClick={() => navigateTo('/quan-ly-lich-hen/danh-gia')}
								style={{ cursor: 'pointer', minHeight: 200 }}
							>
								<p>Xem đánh giá của khách</p>
								<p>Phản hồi đánh giá</p>
								<p>Đánh giá nhân viên</p>
								<Button type='primary' block>
									Xem chi tiết
								</Button>
							</Card>
						</Col>
					</Row>

					{/* Statistics and Reports */}
					<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
						<Col xs={24}>
							<Card
								title='Thống kê & Báo cáo'
								hoverable
								onClick={() => navigateTo('/quan-ly-lich-hen/thong-ke')}
								style={{ cursor: 'pointer' }}
							>
								<p>📊 Xem chi tiết thống kê doanh thu theo dịch vụ và nhân viên</p>
								<p>📈 Biểu đồ lịch hẹn theo ngày/tháng</p>
								<p>💹 Báo cáo chi tiết theo khoảng thời gian</p>
								<Button type='primary'>Xem báo cáo</Button>
							</Card>
						</Col>
					</Row>
				</Card>
			</Spin>
		</div>
	);
};

export default QuanLyLichHenIndex;
