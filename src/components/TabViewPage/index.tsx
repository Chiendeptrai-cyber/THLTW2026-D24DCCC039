import useCheckAccess from '@/hooks/useCheckAccess';
import NotAccessible from '@/pages/exception/403';
import { Affix, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import type { TabViewPageProps } from './typing';

const PermissionWrapper = (props: { content: JSX.Element; accessCode?: string }) => {
	const { accessCode, content } = props;
	const allowAccessCode = useCheckAccess(accessCode!);
	const allow = accessCode ? allowAccessCode : true;
	return allow ? content : <NotAccessible />;
};

const getTitle = (title?: string, menuTitle?: string) => [title, menuTitle].filter(Boolean).join(' - ');

export const TabViewPage = (props: {
	menu: TabViewPageProps[];
	cardTitle?: string;
	hideCard?: boolean;
	onChange?: (key: string) => void;
	children?: React.ReactNode;
}) => {
	const { menu, hideCard, children, onChange, cardTitle } = props;
	const [tabActive, setTabActive] = useState<string | undefined>(menu[0]?.menuKey);
	const [currentTitle, setCurrentTitle] = useState(getTitle(cardTitle, menu[0]?.title));
	const paths = menu.map((item) => item.menuKey);
	const hash = window.location.hash?.replace('#', '') ?? paths[0];

	useEffect(() => {
		if (hash && paths.includes(hash)) setTabActive(hash);
		else setTabActive(paths[0]);
	}, [hash]);

	const onChangeTab = (tab: string) => {
		if (onChange) onChange(tab);
		setCurrentTitle(getTitle(cardTitle, menu.find((item) => item.menuKey === tab)?.title));
		window.location.hash = tab === menu[0]?.menuKey ? '' : tab;
	};

	const mainContent = () => (
		<>
			{children}

			<Affix offsetTop={60}>
				<Tabs activeKey={tabActive} onChange={(key) => onChangeTab(key)} style={{ background: 'white' }}>
					{menu.map((item) => (
						<Tabs.TabPane
							tab={
								<span>
									{item.icon}
									{item.title}
								</span>
							}
							key={item.menuKey}
						/>
					))}
				</Tabs>
			</Affix>

			{menu.map((item) => {
				if (tabActive === item.menuKey) {
					return <PermissionWrapper key={item.menuKey} content={item.content} accessCode={item.accessCode} />;
				}
				return null;
			})}
		</>
	);

	if (hideCard) return mainContent();
	return <Card title={currentTitle}>{mainContent()}</Card>;
};
