import { type ThongBao } from '@/services/ThongBao/typing';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Spin, Tabs, Tooltip } from 'antd';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import type { NoticeIconTabProps } from './NoticeList';
import NoticeList from './NoticeList';
import styles from './index.less';
const { TabPane } = Tabs;

export type NoticeIconProps = {
	count?: number;
	bell?: React.ReactNode;
	className?: string;
	loading?: boolean;
	onClear?: (tabName: string, tabKey: string) => void;
	onItemClick?: (item: ThongBao.IRecord, tabProps: NoticeIconTabProps) => void;
	onViewMore?: (tabProps: NoticeIconTabProps) => void;
	onTabChange?: (tabTile: string) => void;
	style?: React.CSSProperties;
	onPopupVisibleChange?: (visible: boolean) => void;
	popupVisible?: boolean;
	clearText?: string;
	viewMoreText?: string;
	clearClose?: boolean;
	emptyImage?: string;
	children?: React.ReactElement<NoticeIconTabProps>;
};

const NoticeIcon: React.FC<NoticeIconProps> & {
	Tab: typeof NoticeList;
} = (props) => {
	const getNotificationBox = (): React.ReactNode => {
		const { children, loading, onClear, onTabChange, onItemClick, onViewMore, clearText, viewMoreText } = props;
		if (!children) {
			return null;
		}
		const panes: React.ReactNode[] = [];
		React.Children.forEach(children, (child: React.ReactElement<NoticeIconTabProps>): void => {
			if (!child) {
				return;
			}
			const { list, title, count, tabKey, showClear, showViewMore } = child.props;
			const len = list && list.length ? list.length : 0;
			const msgCount = count || count === 0 ? count : len;
			const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title;
			panes.push(
				<TabPane closable={false} tab={tabTitle} key={tabKey}>
					<NoticeList
						clearText={clearText}
						viewMoreText={viewMoreText}
						list={list}
						tabKey={tabKey}
						onClear={() => onClear && onClear(title, tabKey)}
						onClick={(item) => onItemClick && onItemClick(item, child.props)}
						onViewMore={() => onViewMore && onViewMore(child.props)}
						showClear={showClear}
						showViewMore={showViewMore}
						title={title}
					/>
				</TabPane>,
			);
		});
		return (
			<>
				<Spin spinning={loading} delay={300}>
					<Tabs className={styles.tabs} onChange={onTabChange}>
						{panes}
					</Tabs>
				</Spin>
			</>
		);
	};

	const { count, bell } = props;
	const [visible, setVisible] = useMergedState<boolean>(false, {
		value: props.popupVisible,
		onChange: props.onPopupVisibleChange,
	});

	const notificationBox = getNotificationBox();
	if (!notificationBox) return <></>;

	return (
		<HeaderDropdown
			placement='bottomRight'
			overlay={notificationBox}
			overlayClassName={styles.popover}
			trigger={['click']}
			visible={visible}
			onVisibleChange={setVisible}
			arrow
		>
			<Tooltip title='Thông báo' placement='bottom'>
				<a className={styles.badge}>
					<Badge count={count ? (count < 100 ? count : '99+') : undefined} style={{ boxShadow: 'none' }}>
						{bell || <BellOutlined />}
					</Badge>
				</a>
			</Tooltip>
		</HeaderDropdown>
	);
};

NoticeIcon.defaultProps = {
	emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
};

NoticeIcon.Tab = NoticeList;

export default NoticeIcon;
