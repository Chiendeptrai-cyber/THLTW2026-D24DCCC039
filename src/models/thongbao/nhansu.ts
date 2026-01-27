import type { TFilter } from '@/components/Table/typing';
import { postReceiver } from '@/services/ThongBao';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>();
	const [danhSach, setDanhSach] = useState<ThongBao.IUser[]>([]);
	const [danhSachCanBo, setDanhSachCanBo] = useState<ThongBao.IUser[]>([]);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [filters, setFilters] = useState<TFilter<ThongBao.IUser>[]>([
		// Nên để mặc đinh trang thái nhân sự là Đang làm việc
	]);

	const getModel = async (danhSachDoiTuong?: Record<string, string[]>): Promise<ThongBao.IUser[]> => {
		setLoading(true);
		try {
			const payload = { role: EVaiTroKhaoSat.NHAN_VIEN, ...(danhSachDoiTuong ?? {}) };
			const params = {
				page,
				limit,
				filters: [...(filters || [])],
			};
			const response = await postReceiver(payload, params);
			setDanhSach(response?.data?.data?.result ?? []);
			setTotal(response?.data?.data?.total ?? 0);

			return response?.data?.data?.result;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getCanBoChuChotModel = async (danhSachDoiTuong?: Record<string, string[]>): Promise<ThongBao.IUser[]> => {
		setLoading(true);
		try {
			const payload = { role: EVaiTroKhaoSat.NHAN_VIEN, canBoChuChot: true, ...(danhSachDoiTuong ?? {}) };
			const params = {
				page,
				limit: 150,
				filters: [...(filters || [])],
			};
			const response = await postReceiver(payload, params);
			setDanhSachCanBo(response?.data?.data?.result ?? []);

			return response?.data?.data?.result;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		setLoading,
		danhSach,
		setDanhSach,
		danhSachCanBo,
		setDanhSachCanBo,
		page,
		setPage,
		limit,
		setLimit,
		total,
		setTotal,
		filters,
		setFilters,
		getModel,
		getCanBoChuChotModel,
	};
};
