import type { Effect, Reducer } from 'umi';
import { ServicesService } from '@/services/QuanLyLichHen';
import type { Service } from '@/types/lichhen';

interface ServiceModelState {
	list: Service[];
	current: Service | null;
	loading: boolean;
	total: number;
}

interface ServiceModelType {
	namespace: 'service';
	state: ServiceModelState;
	effects: {
		fetchList: Effect;
		fetchById: Effect;
		create: Effect;
		update: Effect;
		delete: Effect;
	};
	reducers: {
		saveList: Reducer<ServiceModelState>;
		saveCurrent: Reducer<ServiceModelState>;
		saveLoading: Reducer<ServiceModelState>;
	};
}

const Model: ServiceModelType = {
	namespace: 'service',

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
				const response = yield call(ServicesService.getList);
				yield put({
					type: 'saveList',
					payload: Array.isArray(response) ? response : response.data || [],
				});
			} catch (error) {
				console.error('Lỗi khi lấy danh sách dịch vụ:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*fetchById({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const response = yield call(ServicesService.getById, payload);
				yield put({
					type: 'saveCurrent',
					payload: response.data || response,
				});
			} catch (error) {
				console.error('Lỗi khi lấy chi tiết dịch vụ:', error);
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*create({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(ServicesService.create, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi thêm dịch vụ:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*update({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				const { id, data } = payload;
				yield call(ServicesService.update, id, data);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi cập nhật dịch vụ:', error);
				throw error;
			} finally {
				yield put({ type: 'saveLoading', payload: false });
			}
		},

		*delete({ payload }, { call, put }) {
			yield put({ type: 'saveLoading', payload: true });
			try {
				yield call(ServicesService.delete, payload);
				yield put({ type: 'fetchList' });
			} catch (error) {
				console.error('Lỗi khi xóa dịch vụ:', error);
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
