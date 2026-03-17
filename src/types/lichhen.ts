// Type definitions cho ứng dụng Quản lý Lịch Hẹn

// Nhân viên
export interface Employee {
	id: string;
	name: string;
	email: string;
	phone: string;
	position: string;
	maxCustomersPerDay: number; // Số khách tối đa/ngày
	workSchedules: WorkSchedule[]; // Lịch làm việc
	averageRating?: number;
	totalReviews?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface WorkSchedule {
	id?: string;
	dayOfWeek: number; // 0-6 (Thứ 2-CN)
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	isWorking: boolean;
}

// Dịch vụ
export interface Service {
	id: string;
	name: string;
	description?: string;
	price: number;
	duration: number; // Phút
	category?: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

// Lịch hẹn
export enum AppointmentStatus {
	PENDING = 'pending', // Chờ duyệt
	CONFIRMED = 'confirmed', // Xác nhận
	COMPLETED = 'completed', // Hoàn thành
	CANCELLED = 'cancelled', // Hủy
}

export interface Appointment {
	id: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	employeeId: string;
	serviceId: string;
	appointmentDate: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime?: string; // HH:mm (tính toán từ service duration)
	status: AppointmentStatus;
	notes?: string;
	totalPrice?: number;
	createdAt?: string;
	updatedAt?: string;
	rating?: Rating; // Đánh giá nếu đã hoàn thành
}

// Đánh giá
export interface Rating {
	id: string;
	appointmentId: string;
	employeeId: string;
	customerId: string;
	rating: number; // 1-5
	comment?: string;
	employeeResponse?: string; // Phản hồi của nhân viên
	createdAt?: string;
	updatedAt?: string;
}

// Response từ API
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	errors?: Record<string, string>;
}

// Thống kê
export interface AppointmentStatistics {
	totalAppointments: number;
	completedAppointments: number;
	cancelledAppointments: number;
	pendingAppointments: number;
	confirmedAppointments: number;
	appointmentsByDate?: Record<string, number>;
	appointmentsByService?: Record<string, number>;
	revenueByService?: Record<string, number>;
	revenueByEmployee?: Record<string, number>;
	revenueTotal?: number;
}

// Thời gian trống
export interface AvailableSlot {
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	employeeId: string;
	serviceId: string;
}
