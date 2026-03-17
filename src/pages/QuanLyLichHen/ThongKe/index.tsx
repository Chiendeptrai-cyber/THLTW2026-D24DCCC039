import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Button, Table, Space, Spin, message } from 'antd';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { StatisticsService, AppointmentService } from '@/services/QuanLyLichHen';
import dayjs, { Dayjs } from 'dayjs';
import {
	CalendarOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DollarOutlined,
	TeamOutlined,
} from '@ant-design/icons';

const ThongKePage: React.FC = () => {
	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([dayjs().subtract(30, 'days'), dayjs()]);
	const [statistics, setStatistics] = useState<any>(null);
	const [appointmentsByDate, setAppointmentsByDate] = useState<any[]>([]);
	const [revenueData, setRevenueData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [appointments, setAppointments] = useState<any[]>([]);

	useEffect(() => {
		fetchStatistics();
	}, [dateRange]);

	const fetchStatistics = async () => {
		setLoading(true);
		try {
			const startDate = dateRange?.[0].format('YYYY-MM-DD');
			const endDate = dateRange?.[1].format('YYYY-MM-DD');

			// Lấy thống kê chung
			const stats = await StatisticsService.getOverallStatistics(startDate, endDate);
			setStatistics(stats);

			// Lấy thống kê theo ngày
			if (startDate && endDate) {
				const byDate = await StatisticsService.getAppointmentsByDate(startDate, endDate);
				setAppointmentsByDate(byDate || []);
			}

			// Lấy thống kê doanh thu
			const revenue = await StatisticsService.getRevenueStatistics(startDate, endDate);
			setRevenueData(revenue || []);

			// Lấy danh sách lịch hẹn
			const apts = await AppointmentService.getList();
			setAppointments(Array.isArray(apts) ? apts : apts.data || []);
		} catch (error) {
			message.error('Lỗi khi tải thống kê!');
		} finally {
			setLoading(false);
		}
	};

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

	const chartData = appointmentsByDate || [];
	const revenueChartData = Array.isArray(revenueData) ? revenueData : [];

	const handleRefresh = () => {
		fetchStatistics();
	};

	return (
		<div className='page-container' style={{ padding: '20px' }}>
			<Spin spinning={loading}>
				{/* Header with Date Range */}
				<Card
					style={{ marginBottom: 24 }}
					title='Bộ lọc thống kê'
					extra={
						<Button type='primary' onClick={handleRefresh}>
							Làm mới
						</Button>
					}
				>
					<Row gutter={16}>
						<Col xs={24} sm={24} md={12}>
							<Space>
								<span>Chọn khoảng thời gian:</span>
								<DatePicker.RangePicker
									value={dateRange}
									onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
									format='DD/MM/YYYY'
								/>
							</Space>
						</Col>
					</Row>
				</Card>

				{/* Key Statistics */}
				<Row gutter={16} style={{ marginBottom: 24 }}>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng lịch hẹn'
								value={statistics?.totalAppointments || 0}
								prefix={<CalendarOutlined />}
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Hoàn thành'
								value={statistics?.completedAppointments || 0}
								prefix={<CheckCircleOutlined />}
								valueStyle={{ color: '#52c41a' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Chờ xác nhận'
								value={statistics?.pendingAppointments || 0}
								prefix={<CalendarOutlined />}
								valueStyle={{ color: '#faad14' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Hủy'
								value={statistics?.cancelledAppointments || 0}
								prefix={<CloseCircleOutlined />}
								valueStyle={{ color: '#f5222d' }}
							/>
						</Card>
					</Col>
				</Row>

				{/* Revenue Statistics */}
				<Row gutter={16} style={{ marginBottom: 24 }}>
					<Col xs={24} sm={24} md={8}>
						<Card>
							<Statistic
								title='Tổng doanh thu'
								value={statistics?.revenueTotal || 0}
								prefix={<DollarOutlined />}
								suffix='VNĐ'
								valueStyle={{ color: '#52c41a' }}
								precision={0}
								formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value as number)}`}
							/>
						</Card>
					</Col>
				</Row>

				{/* Charts */}
				<Row gutter={16} style={{ marginBottom: 24 }}>
					{chartData.length > 0 && (
						<Col xs={24} md={12}>
							<Card title='Lịch hẹn theo ngày'>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={chartData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='date' />
										<YAxis />
										<Tooltip />
										<Bar dataKey='count' fill='#8884d8' />
									</BarChart>
								</ResponsiveContainer>
							</Card>
						</Col>
					)}

					{statistics && (
						<Col xs={24} md={12}>
							<Card title='Thành phần trạng thái lịch hẹn'>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={[
												{ name: 'Hoàn thành', value: statistics.completedAppointments },
												{ name: 'Xác nhận', value: statistics.confirmedAppointments },
												{ name: 'Chờ duyệt', value: statistics.pendingAppointments },
												{ name: 'Hủy', value: statistics.cancelledAppointments },
											]}
											cx='50%'
											cy='50%'
											labelLine={false}
											label={({ name, value }) => `${name}: ${value}`}
											outerRadius={100}
											fill='#8884d8'
											dataKey='value'
										>
											{COLORS.map((color, index) => (
												<Cell key={`cell-${index}`} fill={color} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</Card>
						</Col>
					)}
				</Row>

				{/* Revenue by Service */}
				{revenueChartData.length > 0 && (
					<Row gutter={16} style={{ marginBottom: 24 }}>
						<Col xs={24}>
							<Card title='Doanh thu theo dịch vụ'>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={revenueChartData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='service' />
										<YAxis />
										<Tooltip />
										<Bar dataKey='revenue' fill='#82ca9d' />
									</BarChart>
								</ResponsiveContainer>
							</Card>
						</Col>
					</Row>
				)}

				{/* Appointment Details Table */}
				<Row gutter={16}>
					<Col xs={24}>
						<Card title='Chi tiết lịch hẹn'>
							<Table
								columns={[
									{
										title: 'Khách hàng',
										dataIndex: 'customerName',
										key: 'customerName',
									},
									{
										title: 'Ngày',
										dataIndex: 'appointmentDate',
										key: 'appointmentDate',
										render: (date) => dayjs(date).format('DD/MM/YYYY'),
									},
									{
										title: 'Giờ',
										dataIndex: 'startTime',
										key: 'startTime',
									},
									{
										title: 'Trạng thái',
										dataIndex: 'status',
										key: 'status',
										render: (status) => {
											const colors: Record<string, string> = {
												pending: 'orange',
												confirmed: 'blue',
												completed: 'green',
												cancelled: 'red',
											};
											return <span style={{ color: colors[status] || 'black' }}>{status}</span>;
										},
									},
								]}
								dataSource={Array.isArray(appointments) ? appointments.slice(0, 10) : []}
								pagination={false}
								size='small'
							/>
						</Card>
					</Col>
				</Row>
			</Spin>
		</div>
	);
};

export default ThongKePage;
