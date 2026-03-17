import type { Effect, Reducer } from 'umi';
import { EmployeeService, AppointmentService } from '@/services/QuanLyLichHen';
import type { Employee } from '@/types/lichhen';

interface EmployeeModelState {
	list: Employee[];
	current: Employee | null;
	loading: boolean;
	total: number;
}

interface EmployeeModelType {
	namespace: 'employee';
	state: EmployeeModelState;
	effects: {
		fetchList: Effect;
		fetchById: Effect;
		create: Effect;
		update: Effect;
		delete: Effect;
		updateWorkSchedule: Effect;
	};
	reducers: {
		saveList: Reducer<EmployeeModelState>;
		saveCurrent: Reducer<EmployeeModelState>;
		saveLoading: Reducer<EmployeeModelState>;
	};
}

const Model: EmployeeModelType = {
	namespace: 'employee',

	state: {
		list: [],
		current: null,
		loading: false,
		total: 0,
	},

	effects: {
		*fetchList(_, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const response = yield call(EmployeeService.getList);
				yield put({
					type: 'saveList',
					payload: Array.isArray(response) ? response : response.data || [],
				});
			} catch (error) {
				console.error('Lỗi khi lấy danh sách nhân viên:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*fetchById({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const response = yield call(EmployeeService.getById, payload);
				yield put({
					type: 'saveCurrent',
					payload: response.data || response,
				});
			} catch (error) {
				console.error('Lỗi khi lấy chi tiết nhân viên:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*create({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(EmployeeService.create, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi thêm nhân viên:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*update({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const { id, data } = payload;
				yield call(EmployeeService.update, id, data);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi cập nhật nhân viên:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*delete({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(EmployeeService.delete, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi xóa nhân viên:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*updateWorkSchedule({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const { id, workSchedules } = payload;
				yield call(EmployeeService.updateWorkSchedule, id, workSchedules);
				yield put({ type: 'fetchById', payload: id });
			} catch (error) {
				console.error('Lỗi khi cập nhật lịch làm việc:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
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
