import { EModuleKey } from '../base/constant';
import type { ThongBao } from './typing';

export enum EReceiverType {
	// Topic = 'Topic',
	User = 'User',
	All = 'All',
	KhoaSinhVien = 'KhoaSinhVien',
	Khoa = 'Khoa',
	Nganh = 'Nganh',
	LopHanhChinh = 'LopHanhChinh',
	LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThongBao: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.User]: 'Người dùng cụ thể',
	[EReceiverType.All]: 'Toàn ' + APP_CONFIG_TIEN_TO_TRUONG,
	[EReceiverType.Khoa]: 'Đơn vị',
	[EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
	[EReceiverType.Nganh]: 'Ngành đào tạo',
	[EReceiverType.LopHanhChinh]: 'Lớp hành chính',
	[EReceiverType.LopHocPhan]: 'Lớp học phần',
};

export const FieldLoaiDoiTuongThongBao: Partial<Record<EReceiverType, keyof ThongBao.IThongKe>> = {
	[EReceiverType.All]: 'tatCa',
	[EReceiverType.Khoa]: 'theoKhoa',
	[EReceiverType.KhoaSinhVien]: 'theoKhoaSinhVien',
	[EReceiverType.Nganh]: 'theoNganh',
	[EReceiverType.LopHanhChinh]: 'theoLopHanhChinh',
	[EReceiverType.LopHocPhan]: 'theoLopHocPhan',
};

export const ColorLoaiDoiTuongThongBao: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.All]: 'blue',
	[EReceiverType.Khoa]: 'blue',
	[EReceiverType.KhoaSinhVien]: 'blue',
	[EReceiverType.Nganh]: 'blue',
	[EReceiverType.LopHanhChinh]: 'blue',
	[EReceiverType.LopHocPhan]: 'blue',
};

export enum NotificationType {
	ONESIGNAL = 'OneSignalService', //Thông báo thường
	EMAIL = 'Email', //Thông báo email
	ALL = 'All', //Thông báo tất cả
}

export enum ESourceTypeNotification {
	SLINK = 'SLINK',
	CONG_CAN_BO = 'CONG_CAN_BO',
	QLDT = 'QLDT',
	TCNS = 'TCNS',
	CONG_TAC_SINH_VIEN = 'CONG_TAC_SINH_VIEN',
	VAN_PHONG_SO = 'VAN_PHONG_SO',
	TAI_CHINH = 'TAI_CHINH',
	KHAO_THI = 'KHAO_THI',
	CSVC = 'CSVC',
	NOTIFICATION = 'NOTIFICATION',
	PORTAL = 'PORTAL',
}

export const mapModuleKey: Partial<Record<ESourceTypeNotification, string>> = {
	[ESourceTypeNotification.SLINK]: 'cong-hoc-vien',
	[ESourceTypeNotification.TAI_CHINH]: 'tai-chinh',
	[ESourceTypeNotification.QLDT]: 'quan-ly-dao-tao',
	[ESourceTypeNotification.VAN_PHONG_SO]: 'van-phong-so',
	[ESourceTypeNotification.CONG_TAC_SINH_VIEN]: 'cong-tac-sinh-vien',
	[ESourceTypeNotification.CONG_CAN_BO]: 'cong-can-bo',
	[ESourceTypeNotification.TCNS]: 'to-chuc-nhan-su',
	[ESourceTypeNotification.KHAO_THI]: 'khao-thi',
	[ESourceTypeNotification.NOTIFICATION]: '',
	[ESourceTypeNotification.PORTAL]: '',
	[ESourceTypeNotification.CSVC]: 'co-so-vat-chat',
};

export const mapModuleKeyToSourceType: Partial<Record<EModuleKey, string>> = {
	[EModuleKey.CONNECT]: ESourceTypeNotification.SLINK,
	[EModuleKey.CONG_CAN_BO]: ESourceTypeNotification.CONG_CAN_BO,
	[EModuleKey.QLDT]: ESourceTypeNotification.QLDT,
	[EModuleKey.TCNS]: ESourceTypeNotification.TCNS,
	[EModuleKey.CTSV]: ESourceTypeNotification.CONG_TAC_SINH_VIEN,
	[EModuleKey.VPS]: ESourceTypeNotification.VAN_PHONG_SO,
	[EModuleKey.TC]: ESourceTypeNotification.TAI_CHINH,
	[EModuleKey.KT]: ESourceTypeNotification.KHAO_THI,
	[EModuleKey.CSVC]: ESourceTypeNotification.CSVC,
	[EModuleKey.QLKH]: '',
	[EModuleKey.CORE]: '',
};

/** Danh mục tất cả các loại thông báo */
export enum ENotificationSource {
	LOP_HANH_CHINH = 'LOP_HANH_CHINH',
	LOP_HOC_PHAN = 'LOP_HOC_PHAN',
	THOI_KHOA_BIEU = 'THOI_KHOA_BIEU',
	DICH_VU_HANH_CHINH = 'DICH_VU_HANH_CHINH',
	KE_HOACH_NAM = 'KE_HOACH_NAM',
	KE_HOACH_HOAT_DONG = 'KE_HOACH_HOAT_DONG',
	TO_CHUC_CONG_VIEC = 'TO_CHUC_CONG_VIEC',
	DU_TOAN_KINH_PHI = 'DU_TOAN_KINH_PHI',
	PHAN_HOI = 'PHAN_HOI',
	KHAO_SAT = 'KHAO_SAT',
	DOT_KHAO_SAT = 'DOT_KHAO_SAT',
	LICH_TUAN = 'LICH_TUAN',
	LICH_TUAN_NHAP = 'LICH_TUAN_NHAP',
}

/** Những URL/Source chỉ sử dụng trong phân hệ hiện tại */
export const mapUrlNotifSource: Partial<Record<ENotificationSource, string>> = {
	[ENotificationSource.LOP_HANH_CHINH]: 'xxx',
};

export enum EVaiTroKhaoSat {
	SINH_VIEN = 'sinh_vien',
	NHAN_VIEN = 'nhan_vien',
}

export const TenVaiTroKhaoSat = {
	[EVaiTroKhaoSat.SINH_VIEN]: 'Sinh viên',
	[EVaiTroKhaoSat.NHAN_VIEN]: 'Cán bộ, giảng viên',
};
