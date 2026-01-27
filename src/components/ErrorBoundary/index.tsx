import { currentRole, sentryDSN } from '@/utils/ip';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import * as Sentry from '@sentry/react';
import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';
import './style.less';

class ErrorBoundary extends React.Component<MyProps, MyState> {
	constructor(props: MyProps) {
		super(props);
		this.state = { error: '', errorInfo: null };
	}

	componentDidMount(): void {
		if (process.env.NODE_ENV !== 'development' && !!sentryDSN)
			Sentry.init({
				dsn: sentryDSN,
				integrations: [new Sentry.BrowserTracing()],
				tracesSampleRate: 0.2,
				release: currentRole,
			});
	}

	componentDidCatch(error: any, errorInfo: any) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
		// You can also log error messages to an error reporting service here
	}

	render() {
		if (this.state.errorInfo) {
			// Error path
			return (
				<div>
					<Result
						status='error'
						title='Có lỗi xảy ra'
						subTitle={
							<p>
								Rất tiếc, chức năng này hiện đang hoạt động không chính xác.
								<br />
								Vui lòng thử lại hoặc liên hệ với quản trị viên!
							</p>
						}
						extra={[
							<Button
								onClick={() => {
									history.push('/');
									window.location.reload();
								}}
								key='1'
								icon={<HomeOutlined />}
							>
								Về trang chủ
							</Button>,
							<Button key='buy' onClick={() => window.location.reload()} type='primary' icon={<ReloadOutlined />}>
								Tải lại trang
							</Button>,
						]}
					>
						{process.env.NODE_ENV === 'development' ? (
							<div className='desc'>
								<b>Thông tin lỗi:</b>
								<br />
								<details style={{ whiteSpace: 'pre-wrap' }}>
									{this.state.error ? this.state.error.toString() : ''}
									<br />
									{this.state.errorInfo.componentStack}
								</details>
							</div>
						) : null}
					</Result>
				</div>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}

export default ErrorBoundary;

type MyProps = {
	// using `interface` is also ok
	children: any;
};
type MyState = {
	error?: string; // like this
	errorInfo?: any;
};
