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
		path: '/van-bang',
		name: 'VanBang',
		icon: 'BookOutlined',
		component: './VanBang',
	},
	{
		path: '/cau-lac-bo',
		name: 'CauLacBo',
		icon: 'TeamOutlined',
		component: './CauLacBo',
	},
	{
		path: '/du-lich',
		name: 'DuLich',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/du-lich/kham-pha',
				name: 'KhamPha',
				icon: 'SearchOutlined',
				component: './DuLich/KhamPha',
			},
			{
				path: '/du-lich/lich-trinh',
				name: 'LichTrinh',
				icon: 'ScheduleOutlined',
				component: './DuLich/LichTrinh',
			},
			{
				path: '/du-lich/ngan-sach',
				name: 'NganSach',
				icon: 'DollarOutlined',
				component: './DuLich/NganSach',
			},
			{
				path: '/du-lich/admin',
				name: 'Admin',
				icon: 'SettingOutlined',
				routes: [
					{
						path: '/du-lich/admin/diem-den',
						name: 'QuanLyDiemDen',
						component: './DuLich/Admin/QuanLyDiemDen',
					},
					{
						path: '/du-lich/admin/thong-ke',
						name: 'ThongKe',
						component: './DuLich/Admin/ThongKe',
					},
				],
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
		path: '/',
		redirect: '/dashboard',
	},
	{
		component: './exception/404',
	},
];
