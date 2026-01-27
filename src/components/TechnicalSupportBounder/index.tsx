import { ToolOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<ConfigProvider>
			{props.children}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<Tooltip title='Phản hồi kĩ thuật' placement='topLeft'>
						<Button
							onClick={() => setVisible(true)}
							style={{
								position: 'fixed',
								bottom: 90,
								right: 24,
								zIndex: 10,
								boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
								padding: 0,
							}}
							shape='circle'
							size='large'
							type='primary'
						>
							<ToolOutlined />
						</Button>
					</Tooltip>

					<Modal
						bodyStyle={{ padding: 0 }}
						footer={false}
						visible={visible}
						onCancel={() => setVisible(false)}
						maskClosable={false}
					>
						<FormPostIssue setVisible={setVisible} visible={visible} />
					</Modal>
				</>
			) : null}
		</ConfigProvider>
	);
};

export default TechnicalSupportBounder;
