import { DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import './style.less';

const LoadingPage = () => {
	const onClearCache = () => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = '/';
		window.location.reload();
	};

	return (
		<div className='loading-content'>
			<Spin spinning size='large' />

			<h2>Vui lòng đợi trong giây lát</h2>
			<h3>Đang chuyển hướng tới trang đích...</h3>

			<span className='loading-description'>Nếu phải chờ đợi quá lâu, bạn có thể</span>
			<div className='loading-actions'>
				{/* <Button icon={<HomeOutlined />} type='primary' onClick={() => (window.location.href = '/')}>
					Về trang chủ
				</Button> */}
				<Button type='link' danger icon={<DeleteOutlined />} onClick={onClearCache}>
					Xóa bộ nhớ đệm
				</Button>
			</div>
		</div>
	);
};

export default LoadingPage;
