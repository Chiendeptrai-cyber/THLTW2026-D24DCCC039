import type { ELoaiPhanHoi } from './constant';

declare module PhanHoi {
	export interface IRecord {
		_id: string;
		createdAt?: string;
		updatedAt?: string;
		idDonDVMC?: string;
		loaiPhanHoi: ELoaiPhanHoi;
		noiDungPhanHoi: string;
		urlPhanAnh?: string | null;

		maDonVi?: string;
		donVi?: ToChucNhanSu.IDonVi;
		noiDungTraLoiPhanHoi: string;
		daTraLoiPhanHoi: boolean;
		maChuyenVien: string;
		tenDonVi: string;
		thoiGianTraLoi: string;
	}
}
