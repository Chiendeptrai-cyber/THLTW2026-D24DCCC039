import type { IInitialState } from './services/base/typing';
// import { currentRole } from './utils/ip';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
	// const scopes = initialState.authorizedPermissions?.find((item) => item.rsname === currentRole)?.scopes;
	const scopes = initialState.authorizedPermissions?.map((item) => item.scopes).flat();

	return {
		// canBoQLKH: token && vaiTro && vaiTro === 'can_bo_qlkh',
		// lanhDao: token && vaiTro && vaiTro === 'lanh_dao',
		// sinhVienVaNhanVien: token && vaiTro && ['nhan_vien', 'sinh_vien'].includes(vaiTro),
		// adminVaCanBoQLKH: token && vaiTro && ['Admin', 'can_bo_qlkh'].includes(vaiTro),
		// nhanVienVaCanBoQLKH: token && vaiTro && ['nhan_vien', 'can_bo_qlkh'].includes(vaiTro),
		// adminVaQuanTri: token && vaiTro && ['Admin', 'quan_tri'].includes(vaiTro),
		// admin: (token && vaiTro && vaiTro === 'Admin') || false,
		// nhanVien: (token && vaiTro && vaiTro === 'nhan_vien') || false,
		// keToan: (token && vaiTro && vaiTro === 'ke_toan') || false,
		// sinhVien: (token && vaiTro && vaiTro === 'sinh_vien') || false,
		// quanTri: (token && vaiTro && vaiTro === 'quan_tri') || false,
		// chuyenVien: (token && vaiTro && vaiTro === 'chuyen_vien') || false,
		// adminVaQuanTriVaNhanVien:
		//   (token &&
		//     vaiTro &&
		//     (vaiTro === 'Admin' || vaiTro === 'quan_tri' || vaiTro === 'nhan_vien')) ||
		//   false,
		// guest: (token && ((vaiTro && vaiTro === 'Guest') || !vaiTro)) || false,
		accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
		manyAccessFilter: (route: any) => route?.listChucNang?.some((role: string) => scopes?.includes(role)) || false,
		// adminAccessFilter: (route: any) =>
		//   (token && vaiTro && vaiTro === 'Admin') ||
		//   initialState?.phanNhom?.nhom_vai_tro?.includes(route?.maChucNang) ||
		//   false,
		// adminManyAccessFilter: (route: any) =>
		//   (token && vaiTro && vaiTro === 'Admin') ||
		//   route?.listChucNang?.filter((role: string) =>
		//     initialState?.phanNhom?.nhom_vai_tro?.includes(role),
		//   )?.length ||
		//   false,
		// nhanVienAccessFilter: (route: any) =>
		//   (token && vaiTro && vaiTro === 'nhan_vien') ||
		//   (token && vaiTro && vaiTro === 'Admin') ||
		//   initialState?.phanNhom?.nhom_vai_tro?.includes(route?.maChucNang) ||
		//   false,
		// routeFilter: (route: any) =>
		//   (token && vaiTro && vaiTro === 'Admin') ||
		//   (token && vaiTro && initialState?.phanNhom?.nhom_vai_tro?.includes(route?.maChucNang)) ||
		//   false,
		// routeFilterCanBoQLKHDonVi: (route: any) => {
		//   return handlePhanNhom(initialState, route?.maChucNang) && isCanBoQLKHDonVi;
		// },
		// routeFilterCanBoPhongQLKH: (route: any) => {
		//   return handlePhanNhom(initialState, route?.maChucNang) && isCanBoPhongQLKH;
		// },
		// sinhVienRouteFilter:
		//   vaiTro === 'sinh_vien'
		//     ? true
		//     : (route: any) => {
		//         return handlePhanNhom(initialState, route?.maChucNang) || false;
		//       },
	};
}
