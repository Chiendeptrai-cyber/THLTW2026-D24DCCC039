import { getThongBao, readNotification } from '@/services/ThongBao';
import { type ThongBao } from '@/services/ThongBao/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [record, setRecord] = useState<ThongBao.IRecord>();
	const [danhSach, setDanhSach] = useState<ThongBao.IRecord[]>([]);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(20);
	const [total, setTotal] = useState<number>(0);
	const [unread, setUnread] = useState<number>(0);

	const getThongBaoModel = async (): Promise<ThongBao.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getThongBao({
				page,
				limit,
				condition: undefined,
				sort: { createdAt: -1 },
			});
			setDanhSach(response?.data?.data?.result ?? []);
			setUnread(response?.data?.data?.unread ?? 0);
			setTotal(response?.data?.data?.total ?? 0);

			return response?.data?.data?.result;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const readNotificationModel = async (type: 'ALL' | 'ONE', notificationId?: string): Promise<any> => {
		setLoading(true);
		try {
			const response = await readNotification({ type, notificationId });
			getThongBaoModel();
			if (type === 'ALL') message.success('Đã đọc tất cả thông báo');

			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		unread,
		total,
		danhSach,
		setDanhSach,
		page,
		setPage,
		limit,
		setLimit,
		record,
		setRecord,
		loading,
		setLoading,
		getThongBaoModel,
		readNotificationModel,
	};
};
