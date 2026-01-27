import { HomeOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { useModel } from 'umi';

const NotAccessible = () => {
	const { initialState } = useModel('@@initialState');

	if (initialState?.permissionLoading)
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
				<Spin spinning />
				<div>Loading...</div>
			</div>
		);
	return (
		<Result
			status='403'
			title='Truy cập bị từ chối'
			style={{
				background: 'none',
			}}
			subTitle='Xin lỗi, bạn không có quyền truy cập trang này.'
			extra={
				<Button type='primary' icon={<HomeOutlined />} onClick={() => (window.location.href = '/')}>
					Về trang chủ
				</Button>
			}
		/>
	);
};

export default NotAccessible;
