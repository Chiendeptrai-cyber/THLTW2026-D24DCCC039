import axios from '@/utils/axios';
import { ipNotif } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';

export async function postReceiver(payload: any, params: { page: number; limit: number }) {
	return axios.post(`${ipNotif}/notification/receiver/page`, payload, { params });
}

export async function readNotification(payload: { type: 'ONE' | 'ALL'; notificationId?: any }) {
	return axios.post(`${ipNotif}/notification/read`, payload);
}
export async function thongKeNotification() {
	return axios.get(`${ipNotif}/notification/thong-ke`);
}
export async function deleteThongBao(id: string) {
	return axios.delete(`${ipNotif}/notification/${id}`);
}
export async function thongKeNotificationNguoiNhan(id: string) {
	return axios.get(`${ipNotif}/notification/${id}/receiver/thong-ke`);
}
export async function importNguoiNhanThongBao(payload: any, role: any) {
	const formData = buildFormData(payload);
	return axios.post(`${ipNotif}/notification/receiver/many/import/${role}`, formData);
}
export async function dowLoadBieuMauNguoiNhan() {
	return axios.get(`${ipNotif}/notification/import/template/xlsx`, { responseType: 'arraybuffer' });
}

export async function guiThongBaoDanhSach(payload: {
	file: string | Blob;
	loai: string;
	title: string;
	content: string;
	senderName: string;
	vaiTroNguoiNhan: string;
	gui: string;
}) {
	const form = new FormData();
	form.append('file', payload?.file);
	form.append('loai', payload?.loai);
	form.append('title', payload?.title);
	form.append('content', payload?.content);
	form.append('senderName', payload?.senderName);
	form.append('vaiTroNguoiNhan', payload?.vaiTroNguoiNhan);
	form.append('gui', payload?.gui);

	return axios.post(`${ipNotif}/notification/send`, form);
}

export async function getThongBao(payload: {
	page: number;
	limit: number;
	condition: any;
	sort: { createdAt: 1 | -1 };
}) {
	return axios.get(`${ipNotif}/notification/me/page`, { params: payload });
}

export async function getReceiver(
	notificationId: string,
	payload: {
		page: number;
		limit: number;
		condition?: any;
		sort?: { createdAt: 1 | -1 };
	},
) {
	return axios.get(`${ipNotif}/notification/${notificationId}/receiver/page`, { params: payload });
}
