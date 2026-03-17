export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		icon: 'BgColorsOutlined',
		component: './OanTuTi',
	},
	{
		name: 'Quản lý Lịch hẹn',
		path: '/quan-ly-lich-hen',
		icon: 'CalendarOutlined',
		routes: [
			{
				path: 'nhan-vien',
				name: 'Quản lý Nhân viên',
				component: './QuanLyLichHen/NhanVien',
			},
			{
				path: 'dich-vu',
				name: 'Quản lý Dịch vụ',
				component: './QuanLyLichHen/DichVu',
			},
			{
				path: 'lich-hen',
				name: 'Quản lý Lịch hẹn',
				component: './QuanLyLichHen/LichHen',
			},
			{
				path: 'danh-gia',
				name: 'Đánh giá & Nhận xét',
				component: './QuanLyLichHen/DanhGia',
			},
			{
				path: 'thong-ke',
				name: 'Thống kê & Báo cáo',
				component: './QuanLyLichHen/ThongKe',
			},
		],
	},
	{
		name: 'Quản lý đề thi',
		path: '/quan-ly-de-thi',
		icon: 'FileTextOutlined',
		routes: [
			{
				path: 'khoi-kien-thuc',
				name: 'Khối kiến thức',
				component: './QuanLyDeThiTuLuan/KhoiKienThuc',
			},
			{
				path: 'mon-hoc',
				name: 'Môn học',
				component: './QuanLyDeThiTuLuan/MonHoc',
			},
			{
				path: 'cau-hoi',
				name: 'Câu hỏi',
				component: './QuanLyDeThiTuLuan/CauHoi',
			},
			{
				path: 'cau-truc-de-thi',
				name: 'Cấu trúc đề thi',
				component: './QuanLyDeThiTuLuan/CauTrucDeThiTuLuan',
			},
			{
				path: 'tao-de-thi',
				name: 'Tạo đề thi',
				component: './QuanLyDeThiTuLuan/TaoDeThiTuLuan',
			},
			{
				path: 'quan-ly-de-thi-da-tao',
				name: 'Đề thi đã tạo',
				component: './QuanLyDeThiTuLuan/QuanLyDeThiDaTao',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
