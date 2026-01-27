import useInitModel from '@/hooks/useInitModel';
import { guiThongBaoDanhSach, importNguoiNhanThongBao } from '@/services/ThongBao';
import type { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { ipNotif } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ThongBao.IRecord>('notification', undefined, undefined, ipNotif);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [sortTime, setSortTime] = useState<any[]>([]);
	const [visibleThongBaoDanhSach, setVisibleThongBaoDanhSach] = useState<boolean>(false);
	const [recordThongBaoDanhSach, setRecordThongBaoDanhSach] = useState<any>();
	const [danhSachThongBaoDanhSach, setDanhSachThongBaoDanhSach] = useState<any[]>();

	const importNguoiNhanThongBaoModel = async (payload: any, role: EVaiTroKhaoSat): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await importNguoiNhanThongBao(payload, role);
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const guiThongBaoDanhSachModal = async (
		file: any,
		loai: string,
		title: string,
		content: string,
		senderName: string,
		vaiTroNguoiNhan: string,
		gui: string,
		getData?: () => void,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		setRecordThongBaoDanhSach({
			file,
			loai,
			title,
			content,
			senderName,
			vaiTroNguoiNhan,
			gui,
		});
		try {
			const response = await guiThongBaoDanhSach({
				file: file?.originFileObj,
				loai,
				title,
				content,
				senderName,
				vaiTroNguoiNhan,
				gui,
			});
			setDanhSachThongBaoDanhSach(response?.data?.data);

			if (getData) getData();
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		danhSachThongBaoDanhSach,
		setDanhSachThongBaoDanhSach,
		recordThongBaoDanhSach,
		setRecordThongBaoDanhSach,
		sortTime,
		setSortTime,
		visibleThongBaoDanhSach,
		setVisibleThongBaoDanhSach,
		importNguoiNhanThongBaoModel,
		guiThongBaoDanhSachModal,
	};
};
