import Footer from '@/components/Footer';
import { landingUrl } from '@/services/base/constant';
import { Result } from 'antd';
import { useEffect } from 'react';
import { history } from 'umi';

const DangCapNhatPage = () => {
	// Nếu Đang cập nhật thì bỏ cái này đi
	useEffect(() => {
		history.replace('/dashboard');
	}, []);

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'column',
			}}
		>
			<Result
				status='404'
				title='Đang cập nhật'
				style={{ background: 'none' }}
				subTitle='Hệ thống đang cập nhật. Vui lòng thử lại sau!'
				extra={<a href={landingUrl}>Tới trang Cổng thông tin</a>}
			/>

			<Footer />
		</div>
	);
};
export default DangCapNhatPage;
