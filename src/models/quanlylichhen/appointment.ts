import type { Effect, Reducer } from 'umi';
import { AppointmentService } from '@/services/QuanLyLichHen';
import type { Appointment } from '@/types/lichhen';

interface AppointmentModelState {
	list: Appointment[];
	current: Appointment | null;
	loading: boolean;
	total: number;
}

interface AppointmentModelType {
	namespace: 'appointment';
	state: AppointmentModelState;
	effects: {
		fetchList: Effect;
		fetchById: Effect;
		create: Effect;
		update: Effect;
		updateStatus: Effect;
		delete: Effect;
		checkConflict: Effect;
		getAvailableSlots: Effect;
	};
	reducers: {
		saveList: Reducer<AppointmentModelState>;
		saveCurrent: Reducer<AppointmentModelState>;
		saveLoading: Reducer<AppointmentModelState>;
	};
}

const Model: AppointmentModelType = {
	namespace: 'appointment',

	state: {
		list: [],
		current: null,
		loading: false,
		total: 0,
	},

	effects: {
		*fetchList({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const response = yield call(AppointmentService.getList, payload);
				yield put({
					type: 'saveList',
					payload: Array.isArray(response) ? response : response.data || [],
				});
			} catch (error) {
				console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*fetchById({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const response = yield call(AppointmentService.getById, payload);
				yield put({
					type: 'saveCurrent',
					payload: response.data || response,
				});
			} catch (error) {
				console.error('Lỗi khi lấy chi tiết lịch hẹn:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*create({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(AppointmentService.create, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi đặt lịch hẹn:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*update({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const { id, data } = payload;
				yield call(AppointmentService.update, id, data);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi cập nhật lịch hẹn:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*updateStatus({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const { id, status } = payload;
				yield call(AppointmentService.updateStatus, id, status);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*delete({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(AppointmentService.delete, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi xóa lịch hẹn:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*checkConflict({ payload }, { call }) {
			try {
				const response = yield call(AppointmentService.checkConflict, payload);
				return response;
			} catch (error) {
				console.error('Lỗi khi kiểm tra trùng lịch:', error);
				throw error;
			}
		},

		*getAvailableSlots({ payload }, { call }) {
			try {
				const response = yield call(AppointmentService.getAvailableSlots, payload);
				return response;
			} catch (error) {
				console.error('Lỗi khi lấy thời gian trống:', error);
				throw error;
			}
		},
	},

	reducers: {
		saveList(state, { payload }) {
			return {
				...state,
				list: payload,
				total: payload?.length || 0,
			};
		},

		saveCurrent(state, { payload }) {
			return {
				...state,
				current: payload,
			};
		},

		saveLoading(state, { payload }) {
			return {
				...state,
				loading: payload,
			};
		},
	},
};

export default Model;
