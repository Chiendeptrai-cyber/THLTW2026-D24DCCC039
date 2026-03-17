import type { Employee, Service, Appointment, Rating } from '@/types/lichhen';

// Mock Employees
export const mockEmployees: Employee[] = [
	{
		id: '1',
		name: 'Nguyễn Văn A',
		email: 'nguyenvana@example.com',
		phone: '0912345678',
		position: 'Thợ cắt tóc',
		maxCustomersPerDay: 8,
		workSchedules: [
			{ dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isWorking: true },
			{ dayOfWeek: 6, startTime: '10:00', endTime: '15:00', isWorking: true },
		],
		averageRating: 4.8,
		totalReviews: 12,
	},
	{
		id: '2',
		name: 'Trần Thị B',
		email: 'tranthib@example.com',
		phone: '0987654321',
		position: 'Spa Therapist',
		maxCustomersPerDay: 6,
		workSchedules: [
			{ dayOfWeek: 0, startTime: '10:00', endTime: '18:00', isWorking: true },
			{ dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isWorking: true },
			{ dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isWorking: true },
			{ dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isWorking: true },
			{ dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isWorking: true },
			{ dayOfWeek: 5, startTime: 'OFF', endTime: 'OFF', isWorking: false },
			{ dayOfWeek: 6, startTime: '10:00', endTime: '16:00', isWorking: true },
		],
		averageRating: 4.5,
		totalReviews: 8,
	},
];

// Mock Services
export const mockServices: Service[] = [
	{
		id: '1',
		name: 'Cắt tóc nam',
		description: 'Cắt tóc nam chuyên nghiệp',
		price: 50000,
		duration: 30,
		category: 'Cắt tóc',
		isActive: true,
	},
	{
		id: '2',
		name: 'Cắt tóc nữ',
		description: 'Cắt tóc nữ phục vụ',
		price: 100000,
		duration: 45,
		category: 'Cắt tóc',
		isActive: true,
	},
	{
		id: '3',
		name: 'Massage cơ bản',
		description: 'Massage toàn thân 60 phút',
		price: 300000,
		duration: 60,
		category: 'Spa',
		isActive: true,
	},
	{
		id: '4',
		name: 'Massage đặc biệt',
		description: 'Massage đặc biệt 90 phút',
		price: 450000,
		duration: 90,
		category: 'Spa',
		isActive: true,
	},
	{
		id: '5',
		name: 'Nhuộm tóc',
		description: 'Nhuộm tóc chất lượng cao',
		price: 150000,
		duration: 120,
		category: 'Tóc',
		isActive: true,
	},
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
	{
		id: '1',
		customerId: 'cust1',
		customerName: 'Phạm Văn C',
		customerPhone: '0901234567',
		customerEmail: 'phamvanc@example.com',
		employeeId: '1',
		serviceId: '1',
		appointmentDate: '2026-03-20',
		startTime: '09:00',
		endTime: '09:30',
		status: 'confirmed',
		notes: 'Cắt kiểu ngắn',
		totalPrice: 50000,
	},
	{
		id: '2',
		customerId: 'cust2',
		customerName: 'Lê Thị D',
		customerPhone: '0902345678',
		customerEmail: 'lethid@example.com',
		employeeId: '2',
		serviceId: '3',
		appointmentDate: '2026-03-21',
		startTime: '10:00',
		endTime: '11:00',
		status: 'pending',
		notes: 'Massage toàn thân',
		totalPrice: 300000,
	},
];

// Mock Ratings
export const mockRatings: Rating[] = [
	{
		id: '1',
		appointmentId: '1',
		employeeId: '1',
		customerId: 'cust1',
		rating: 5,
		comment: 'Rất hài lòng với dịch vụ, nhân viên rất chuyên nghiệp!',
		employeeResponse: 'Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!',
	},
];
