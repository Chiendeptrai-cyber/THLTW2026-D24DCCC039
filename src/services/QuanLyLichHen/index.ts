import { request } from 'umi';
import type { Employee, Service, Appointment, Rating, AppointmentStatistics } from '@/types/lichhen';

const ENDPOINT = '/api/appointment-management';

// ============= EMPLOYEE SERVICES =============
export const EmployeeService = {
	// Lấy danh sách nhân viên
	getList: () => request<Employee[]>(`${ENDPOINT}/employees`, { method: 'GET' }),

	// Lấy chi tiết nhân viên
	getById: (id: string) => request<Employee>(`${ENDPOINT}/employees/${id}`, { method: 'GET' }),

	// Thêm nhân viên
	create: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
		request<Employee>(`${ENDPOINT}/employees`, { method: 'POST', data }),

	// Cập nhật nhân viên
	update: (id: string, data: Partial<Employee>) =>
		request<Employee>(`${ENDPOINT}/employees/${id}`, { method: 'PUT', data }),

	// Xóa nhân viên
	delete: (id: string) => request(`${ENDPOINT}/employees/${id}`, { method: 'DELETE' }),

	// Cập nhật lịch làm việc
	updateWorkSchedule: (employeeId: string, workSchedules: any[]) =>
		request(`${ENDPOINT}/employees/${employeeId}/work-schedule`, {
			method: 'PUT',
			data: { workSchedules },
		}),
};

// ============= SERVICE SERVICES =============
export const ServicesService = {
	// Lấy danh sách dịch vụ
	getList: () => request<Service[]>(`${ENDPOINT}/services`, { method: 'GET' }),

	// Lấy chi tiết dịch vụ
	getById: (id: string) => request<Service>(`${ENDPOINT}/services/${id}`, { method: 'GET' }),

	// Thêm dịch vụ
	create: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) =>
		request<Service>(`${ENDPOINT}/services`, { method: 'POST', data }),

	// Cập nhật dịch vụ
	update: (id: string, data: Partial<Service>) =>
		request<Service>(`${ENDPOINT}/services/${id}`, { method: 'PUT', data }),

	// Xóa dịch vụ
	delete: (id: string) => request(`${ENDPOINT}/services/${id}`, { method: 'DELETE' }),
};

// ============= APPOINTMENT SERVICES =============
export const AppointmentService = {
	// Lấy danh sách lịch hẹn
	getList: (filters?: Record<string, any>) =>
		request<Appointment[]>(`${ENDPOINT}/appointments`, {
			method: 'GET',
			params: filters,
		}),

	// Lấy chi tiết lịch hẹn
	getById: (id: string) => request<Appointment>(`${ENDPOINT}/appointments/${id}`, { method: 'GET' }),

	// Đặt lịch hẹn
	create: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) =>
		request<Appointment>(`${ENDPOINT}/appointments`, { method: 'POST', data }),

	// Cập nhật lịch hẹn
	update: (id: string, data: Partial<Appointment>) =>
		request<Appointment>(`${ENDPOINT}/appointments/${id}`, { method: 'PUT', data }),

	// Xóa lịch hẹn
	delete: (id: string) => request(`${ENDPOINT}/appointments/${id}`, { method: 'DELETE' }),

	// Cập nhật trạng thái lịch hẹn
	updateStatus: (id: string, status: string) =>
		request<Appointment>(`${ENDPOINT}/appointments/${id}/status`, {
			method: 'PUT',
			data: { status },
		}),

	// Kiểm tra trùng lịch
	checkConflict: (employeeId: string, appointmentDate: string, startTime: string, duration: number) =>
		request<{ hasConflict: boolean; conflictingAppointments?: Appointment[] }>(
			`${ENDPOINT}/appointments/check-conflict`,
			{
				method: 'POST',
				data: { employeeId, appointmentDate, startTime, duration },
			},
		),

	// Lấy thời gian trống
	getAvailableSlots: (employeeId: string, serviceId: string, date: string) =>
		request(`${ENDPOINT}/appointments/available-slots`, {
			method: 'GET',
			params: { employeeId, serviceId, date },
		}),
};

// ============= RATING SERVICES =============
export const RatingService = {
	// Lấy danh sách đánh giá
	getList: (filters?: Record<string, any>) =>
		request<Rating[]>(`${ENDPOINT}/ratings`, { method: 'GET', params: filters }),

	// Lấy đánh giá của nhân viên
	getByEmployeeId: (employeeId: string) =>
		request<Rating[]>(`${ENDPOINT}/ratings/employee/${employeeId}`, { method: 'GET' }),

	// Thêm đánh giá
	create: (data: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>) =>
		request<Rating>(`${ENDPOINT}/ratings`, { method: 'POST', data }),

	// Cập nhật đánh giá
	update: (id: string, data: Partial<Rating>) => request<Rating>(`${ENDPOINT}/ratings/${id}`, { method: 'PUT', data }),

	// Xóa đánh giá
	delete: (id: string) => request(`${ENDPOINT}/ratings/${id}`, { method: 'DELETE' }),

	// Thêm phản hồi từ nhân viên
	addEmployeeResponse: (id: string, response: string) =>
		request<Rating>(`${ENDPOINT}/ratings/${id}/response`, {
			method: 'PUT',
			data: { employeeResponse: response },
		}),
};

// ============= STATISTICS SERVICES =============
export const StatisticsService = {
	// Lấy thống kê chung
	getOverallStatistics: (startDate?: string, endDate?: string) =>
		request<AppointmentStatistics>(`${ENDPOINT}/statistics/overall`, {
			method: 'GET',
			params: { startDate, endDate },
		}),

	// Lấy thống kê theo nhân viên
	getEmployeeStatistics: (employeeId: string, startDate?: string, endDate?: string) =>
		request(`${ENDPOINT}/statistics/employee/${employeeId}`, {
			method: 'GET',
			params: { startDate, endDate },
		}),

	// Lấy thống kê doanh thu
	getRevenueStatistics: (startDate?: string, endDate?: string) =>
		request(`${ENDPOINT}/statistics/revenue`, {
			method: 'GET',
			params: { startDate, endDate },
		}),

	// Lấy thống kê lịch hẹn theo ngày
	getAppointmentsByDate: (startDate: string, endDate: string) =>
		request(`${ENDPOINT}/statistics/appointments-by-date`, {
			method: 'GET',
			params: { startDate, endDate },
		}),

	// Lấy thống kê lịch hẹn theo dịch vụ
	getAppointmentsByService: () => request(`${ENDPOINT}/statistics/appointments-by-service`, { method: 'GET' }),
};
