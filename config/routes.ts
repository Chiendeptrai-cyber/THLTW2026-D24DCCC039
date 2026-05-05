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
	//{
//		path: '/the-duc',
//		name: 'Thể dục',
//		icon: 'HeartOutlined',
//		component: './TheDuc',
//	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/the-duc',
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
		path: '/kanban',
		name: 'Kanban',
		icon: 'ProjectOutlined',
		component: './Kanban',
	},
	{
		path: '/khoa-hoc',
		name: 'Khóa học',
		icon: 'VideoCameraOutlined',
		component: './KhoaHoc',
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

	// BLOG
	{
		path: '/blog',
		name: 'Blog',
		icon: 'FileTextOutlined',
		routes: [
			{
				path: '/blog',
				component: './Blog/index',
			},
			{
				path: '/blog/post/:slug',
				component: './Blog/post-detail',
				hideInMenu: true,
			},
			{
				path: '/blog/about',
				name: 'Về tôi',
				component: './Blog/about',
			},
			{
				path: '/blog/write',
				name: 'Viết bài',
				component: './Blog/write',
			},
			{
				path: '/blog/write/:id',
				component: './Blog/write',
				hideInMenu: true,
			},
			{
				path: '/blog/manage',
				name: 'Quản lý bài viết',
				component: './Blog/manage',
			},
			{
				path: '/blog/tags',
				name: 'Quản lý thẻ',
				component: './Blog/tag-manage',
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
