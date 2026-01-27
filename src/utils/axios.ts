// import { refreshAccesssToken } from '@/services/ant-design-pro/api';
import { message, notification } from 'antd';
import axios from 'axios';
// import { history } from 'umi';
import data from './data';

// function routeLogin(errorCode: string) {
//   // notification.warning({
//   //   message: 'Vui lòng đăng nhập lại',
//   //   description: data.error[errorCode],
//   // });
//   // localStorage.clear();
//   history.replace({
//     pathname: '/user/login',
//   });
// }

// for multiple request
// let isRefreshing = false;
// let failedQueue: any[] = [];
// const processQueue = (error: any, token: any = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

/**
 * Chuyển sang xử lý access_token with OIDC auth ở Technical Support
 */
// Add a request interceptor
// axios.interceptors.request.use(
//   (config) => {
//     if (!config.headers.Authorization) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         // eslint-disable-next-line no-param-reassign
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// Add a response interceptor
axios.interceptors.response.use(
	(response) =>
		// Do something with response data
		response,
	(error) => {
		let er = error?.response?.data;
		// Convert response data to JSON
		if ((error?.response?.config?.responseType as string)?.toLowerCase() === 'arraybuffer') {
			const decoder = new TextDecoder('utf-8');
			er = JSON.parse(decoder.decode(er));
		}
		const descriptionError = Array.isArray(er?.detail?.exception?.response?.message)
			? er?.detail?.exception?.response?.message?.join(', ')
			: // Sequelize validation Errors
			Array.isArray(er?.detail?.exception?.errors)
			? er?.detail?.exception?.errors?.map((e: any) => e?.message)?.join(', ')
			: data.error[er?.detail?.errorCode || er?.errorCode] ||
			  er?.detail?.message ||
			  er?.message ||
			  er?.errorDescription;

		const originalRequest = error.config;
		let originData = originalRequest?.data;
		if (typeof originData === 'string') originData = JSON.parse(originData);
		if (typeof originData !== 'object' || !Object.keys(originData ?? {}).includes('silent') || !originData?.silent)
			switch (error?.response?.status) {
				case 400:
					notification.error({
						message: 'Dữ liệu chưa đúng (004)',
						description: descriptionError,
					});
					break;

				case 401:
					// Nếu có access token (có thể access token hết hạn) thì mới cảnh báo
					if (originalRequest?.headers?.Authorization)
						notification.error({
							message: 'Phiên đăng nhập đã thay đổi (104)',
							description: 'Vui lòng tải lại trang (F5) để cập nhật. Chú ý các dữ liệu chưa lưu sẽ bị mất!',
						});
					if (originalRequest._retry) break;
					break;
				// return routeLogin('Unauthorize');

				///////////////////////////////////////////////////////////////////
				// Tobe removed, token refreshing is handled by OIDC context
				///////////////////////////////////////////////////////////////////
				// const refreshToken = localStorage.getItem('refreshToken');
				// if (!refreshToken || error?.response?.config?.data?.includes('refresh')) {
				//   return routeLogin(error?.response?.data?.errorCode);
				// }
				// if (error?.response?.config?.data?.includes('grant_type')) return;

				// if (isRefreshing) {
				//   // Nếu đang có 1 cái refresh thì thêm request này vào queue;
				//   return new Promise((resolve, reject) => {
				//     failedQueue.push({ resolve, reject });
				//   })
				//     .then((token) => {
				//       // gán lại token mới cho request này rồi gửi lại nó
				//       originalRequest.headers.Authorization = 'Bearer ' + token;
				//       return axios(originalRequest);
				//     })
				//     .catch((err) => {
				//       return Promise.reject(err);
				//     });
				// }

				// originalRequest._retry = true;
				// isRefreshing = true; // Request đầu tiên bị lỗi => call refresh token => isRefreshing

				// return new Promise((resolve, reject) => {
				//   refreshAccesssToken({ refreshToken })
				//     .then((response) => {
				//       // Lưu token mới vào localStorage
				//       localStorage.setItem('token', response?.data?.access_token);
				//       localStorage.setItem('refreshToken', response?.data?.refresh_token);
				//       // Set lại token cho axios
				//       axios.defaults.headers.common.Authorization = `Bearer ${response?.data?.access_token}`;
				//       originalRequest.headers.Authorization = `Bearer ${response?.data?.access_token}`;
				//       processQueue(null, response?.data?.access_token); // Chạy lại các request ở trong queue với token mới
				//       resolve(axios(originalRequest)); // Gửi lại request đầu tiên
				//     })
				//     .catch((err) => {
				//       // Nếu get refresh cũng lỗi => refresh hết hạn => logout
				//       processQueue(err, null);
				//       reject(err);
				//       routeLogin(error?.response?.data?.errorCode);
				//     })
				//     .then(() => {
				//       isRefreshing = false;
				//     });
				// });

				case 403:
				case 405:
					notification.error({
						message: 'Thao tác không được phép (304)',
						description: descriptionError,
					});
					break;

				case 404:
					notification.error({
						message: 'Không tìm thấy dữ liệu (040)',
						description: descriptionError,
					});
					break;

				case 409:
					notification.error({
						message: 'Dữ liệu chưa đúng (904)',
						description: descriptionError,
					});
					break;

				case 500:
				case 502:
					notification.error({
						message: 'Hệ thống đang cập nhật (005)',
						description: descriptionError,
					});
					break;

				default:
					message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
					break;
			}
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axios;
