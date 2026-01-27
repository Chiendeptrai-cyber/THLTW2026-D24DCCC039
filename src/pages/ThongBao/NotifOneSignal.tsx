import { readNotification } from '@/services/ThongBao';
import type { ThongBao } from '@/services/ThongBao/typing';
import queryString from 'query-string';
import { history } from 'umi';
import OneSignalDataToPath from './components/OneSignalDataToPath';

const NotifOneSignal = () => {
	const parsed = queryString.parse(window.location.search);
	readNotification({ notificationId: parsed?.id, type: 'ONE' });

	const path = OneSignalDataToPath(parsed as ThongBao.TNotificationSource);
	history.push(path || '/');
	return <></>;
};

export default NotifOneSignal;
