import { Request, Response } from 'express';

// In-memory storage
const db = {
	employees: [
		{ id: '1', name: 'Nguyễn Văn A', email: 'nva@example.com', phone: '0123456789', position: 'Sales', maxCustomersPerDay: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '2', name: 'Trần Thị B', email: 'ttb@example.com', phone: '0987654321', position: 'Support', maxCustomersPerDay: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
	],
	services: [
		{ id: '1', name: 'Tư vấn cơ bản', description: 'Tư vấn 30 phút', category: 'Tư vấn', price: 100000, duration: 30, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '2', name: 'Tư vấn nâng cao', description: 'Tư vấn 60 phút chi tiết', category: 'Tư vấn', price: 250000, duration: 60, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
	],
	appointments: [
		{ id: '1', employeeId: '1', serviceId: '1', customerName: 'Khách hàng 1', customerPhone: '0111111111', customerEmail: 'kh1@test.com', appointmentDate: '2026-03-15', startTime: '09:00', notes: 'Lần đầu', status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '2', employeeId: '1', serviceId: '2', customerName: 'Khách hàng 2', customerPhone: '0222222222', customerEmail: 'kh2@test.com', appointmentDate: '2026-03-15', startTime: '10:30', notes: '', status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '3', employeeId: '2', serviceId: '1', customerName: 'Khách hàng 3', customerPhone: '0333333333', customerEmail: 'kh3@test.com', appointmentDate: '2026-03-16', startTime: '14:00', notes: '', status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '4', employeeId: '1', serviceId: '2', customerName: 'Khách hàng 4', customerPhone: '0444444444', customerEmail: 'kh4@test.com', appointmentDate: '2026-03-17', startTime: '11:00', notes: '', status: 'confirmed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '5', employeeId: '2', serviceId: '1', customerName: 'Khách hàng 5', customerPhone: '0555555555', customerEmail: 'kh5@test.com', appointmentDate: '2026-03-17', startTime: '15:30', notes: '', status: 'confirmed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '6', employeeId: '1', serviceId: '1', customerName: 'Khách hàng 6', customerPhone: '0666666666', customerEmail: 'kh6@test.com', appointmentDate: '2026-03-18', startTime: '09:30', notes: '', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '7', employeeId: '2', serviceId: '2', customerName: 'Khách hàng 7', customerPhone: '0777777777', customerEmail: 'kh7@test.com', appointmentDate: '2026-03-18', startTime: '13:00', notes: '', status: 'cancelled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '8', employeeId: '1', serviceId: '2', customerName: 'Khách hàng 8', customerPhone: '0888888888', customerEmail: 'kh8@test.com', appointmentDate: '2026-03-19', startTime: '10:00', notes: '', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		{ id: '9', employeeId: '2', serviceId: '1', customerName: 'Khách hàng 9', customerPhone: '0999999999', customerEmail: 'kh9@test.com', appointmentDate: '2026-03-20', startTime: '14:30', notes: '', status: 'confirmed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
	],
	ratings: [
		{ id: '1', appointmentId: '1', employeeId: '1', customerName: 'Khách hàng 1', rating: 5, comment: 'Rất tốt', employeeResponse: 'Cảm ơn bạn!', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
	],
};

let employeeId = 3;
let serviceId = 3;
let appointmentId = 10;
let ratingId = 2;

export default {
	// ============= EMPLOYEE ENDPOINTS =============
	'GET /api/appointment-management/employees': (req: Request, res: Response) => {
		res.status(200).json(db.employees);
	},

	'GET /api/appointment-management/employees/:id': (req: Request, res: Response) => {
		const employee = db.employees.find(e => e.id === req.params.id);
		if (!employee) {
			return res.status(404).json({ message: 'Not found' });
		}
		res.status(200).json(employee);
	},

	'POST /api/appointment-management/employees': (req: Request, res: Response) => {
		const newEmployee = {
			id: String(employeeId++),
			...req.body,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		db.employees.push(newEmployee);
		res.status(201).json(newEmployee);
	},

	'PUT /api/appointment-management/employees/:id': (req: Request, res: Response) => {
		const index = db.employees.findIndex(e => e.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.employees[index] = {
			...db.employees[index],
			...req.body,
			updatedAt: new Date().toISOString(),
		};
		res.status(200).json(db.employees[index]);
	},

	'DELETE /api/appointment-management/employees/:id': (req: Request, res: Response) => {
		const index = db.employees.findIndex(e => e.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.employees.splice(index, 1);
		res.status(204).send();
	},

	// ============= SERVICE ENDPOINTS =============
	'GET /api/appointment-management/services': (req: Request, res: Response) => {
		res.status(200).json(db.services);
	},

	'GET /api/appointment-management/services/:id': (req: Request, res: Response) => {
		const service = db.services.find(s => s.id === req.params.id);
		if (!service) {
			return res.status(404).json({ message: 'Not found' });
		}
		res.status(200).json(service);
	},

	'POST /api/appointment-management/services': (req: Request, res: Response) => {
		const newService = {
			id: String(serviceId++),
			...req.body,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		db.services.push(newService);
		res.status(201).json(newService);
	},

	'PUT /api/appointment-management/services/:id': (req: Request, res: Response) => {
		const index = db.services.findIndex(s => s.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.services[index] = {
			...db.services[index],
			...req.body,
			updatedAt: new Date().toISOString(),
		};
		res.status(200).json(db.services[index]);
	},

	'DELETE /api/appointment-management/services/:id': (req: Request, res: Response) => {
		const index = db.services.findIndex(s => s.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.services.splice(index, 1);
		res.status(204).send();
	},

	// ============= APPOINTMENT ENDPOINTS =============
	'GET /api/appointment-management/appointments': (req: Request, res: Response) => {
		res.status(200).json(db.appointments);
	},

	'GET /api/appointment-management/appointments/:id': (req: Request, res: Response) => {
		const appointment = db.appointments.find(a => a.id === req.params.id);
		if (!appointment) {
			return res.status(404).json({ message: 'Not found' });
		}
		res.status(200).json(appointment);
	},

	'POST /api/appointment-management/appointments': (req: Request, res: Response) => {
		const newAppointment = {
			id: String(appointmentId++),
			...req.body,
			status: req.body.status || 'pending',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		db.appointments.push(newAppointment);
		res.status(201).json(newAppointment);
	},

	'PUT /api/appointment-management/appointments/:id': (req: Request, res: Response) => {
		const index = db.appointments.findIndex(a => a.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.appointments[index] = {
			...db.appointments[index],
			...req.body,
			updatedAt: new Date().toISOString(),
		};
		res.status(200).json(db.appointments[index]);
	},

	'DELETE /api/appointment-management/appointments/:id': (req: Request, res: Response) => {
		const index = db.appointments.findIndex(a => a.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.appointments.splice(index, 1);
		res.status(204).send();
	},

	'PUT /api/appointment-management/appointments/:id/status': (req: Request, res: Response) => {
		const index = db.appointments.findIndex(a => a.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.appointments[index].status = req.body.status;
		db.appointments[index].updatedAt = new Date().toISOString();
		res.status(200).json(db.appointments[index]);
	},

	'POST /api/appointment-management/appointments/check-conflict': (req: Request, res: Response) => {
		const { employeeId, appointmentDate, startTime, duration } = req.body;
		const conflictingAppointments = db.appointments.filter(a => {
			if (a.employeeId !== employeeId || a.appointmentDate !== appointmentDate) return false;
			
			const apptStart = parseInt(a.startTime.replace(':', ''));
			const apptEnd = apptStart + (a.duration || 60);
			const newStart = parseInt(startTime.replace(':', ''));
			const newEnd = newStart + duration;
			
			return !(newEnd <= apptStart || newStart >= apptEnd);
		});

		res.status(200).json({
			hasConflict: conflictingAppointments.length > 0,
			conflictingAppointments,
		});
	},

	'GET /api/appointment-management/appointments/available-slots': (req: Request, res: Response) => {
		res.status(200).json([
			'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
			'13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
		]);
	},

	// ============= RATING ENDPOINTS =============
	'GET /api/appointment-management/ratings': (req: Request, res: Response) => {
		res.status(200).json(db.ratings);
	},

	'GET /api/appointment-management/ratings/employee/:employeeId': (req: Request, res: Response) => {
		const ratings = db.ratings.filter(r => r.employeeId === req.params.employeeId);
		res.status(200).json(ratings);
	},

	'POST /api/appointment-management/ratings': (req: Request, res: Response) => {
		const newRating = {
			id: String(ratingId++),
			...req.body,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		db.ratings.push(newRating);
		res.status(201).json(newRating);
	},

	'PUT /api/appointment-management/ratings/:id': (req: Request, res: Response) => {
		const index = db.ratings.findIndex(r => r.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.ratings[index] = {
			...db.ratings[index],
			...req.body,
			updatedAt: new Date().toISOString(),
		};
		res.status(200).json(db.ratings[index]);
	},

	'DELETE /api/appointment-management/ratings/:id': (req: Request, res: Response) => {
		const index = db.ratings.findIndex(r => r.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.ratings.splice(index, 1);
		res.status(204).send();
	},

	'PUT /api/appointment-management/ratings/:id/response': (req: Request, res: Response) => {
		const index = db.ratings.findIndex(r => r.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Not found' });
		}
		db.ratings[index].employeeResponse = req.body.employeeResponse;
		db.ratings[index].updatedAt = new Date().toISOString();
		res.status(200).json(db.ratings[index]);
	},

	// ============= STATISTICS ENDPOINTS =============
	'GET /api/appointment-management/statistics/overall': (req: Request, res: Response) => {
		const totalAppointments = db.appointments.length;
		const completedAppointments = db.appointments.filter(a => a.status === 'completed').length;
		const confirmedAppointments = db.appointments.filter(a => a.status === 'confirmed').length;
		const pendingAppointments = db.appointments.filter(a => a.status === 'pending').length;
		const cancelledAppointments = db.appointments.filter(a => a.status === 'cancelled').length;

		const revenueTotal = db.appointments.reduce((sum, a) => {
			const service = db.services.find(s => s.id === a.serviceId);
			return sum + (service?.price || 0);
		}, 0);

		res.status(200).json({
			totalAppointments,
			completedAppointments,
			confirmedAppointments,
			pendingAppointments,
			cancelledAppointments,
			revenueTotal,
		});
	},

	'GET /api/appointment-management/statistics/appointments-by-date': (req: Request, res: Response) => {
		const { startDate, endDate } = req.query;
		
		// Group appointments by date and count them
		const appointmentsByDate: Record<string, number> = {};
		
		db.appointments.forEach(apt => {
			if (!startDate || !endDate || (apt.appointmentDate >= startDate && apt.appointmentDate <= endDate)) {
				const date = apt.appointmentDate;
				appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;
			}
		});

		// Convert to array format for Recharts
		const result = Object.entries(appointmentsByDate)
			.map(([date, count]) => ({ date, count }))
			.sort((a, b) => a.date.localeCompare(b.date));

		res.status(200).json(result);
	},

	'GET /api/appointment-management/statistics/appointments-by-service': (req: Request, res: Response) => {
		const serviceStats = db.services.map(service => ({
			name: service.name,
			count: db.appointments.filter(a => a.serviceId === service.id).length,
			revenue: db.appointments
				.filter(a => a.serviceId === service.id && a.status === 'completed')
				.reduce((sum) => sum + service.price, 0),
		}));

		res.status(200).json(serviceStats);
	},

	'GET /api/appointment-management/statistics/revenue': (req: Request, res: Response) => {
		const { startDate, endDate } = req.query;
		
		const revenueByService = db.services.map(service => ({
			name: service.name,
			revenue: db.appointments
				.filter(a => {
					const isMatchingService = a.serviceId === service.id && a.status === 'completed';
					if (!startDate || !endDate) return isMatchingService;
					return isMatchingService && a.appointmentDate >= startDate && a.appointmentDate <= endDate;
				})
				.reduce((sum) => sum + service.price, 0),
		}));

		res.status(200).json(revenueByService);
	},

	'GET /api/appointment-management/statistics/employee/:employeeId': (req: Request, res: Response) => {
		const appointments = db.appointments.filter(a => a.employeeId === req.params.employeeId);
		const totalAppointments = appointments.length;
		const completedAppointments = appointments.filter(a => a.status === 'completed').length;
		const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
		const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
		const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

		res.status(200).json({
			totalAppointments,
			completedAppointments,
			confirmedAppointments,
			pendingAppointments,
			cancelledAppointments,
		});
	},
};
