import { ENotificationSource, mapUrlNotifSource } from '@/services/ThongBao/constant';
import type { ThongBao } from '@/services/ThongBao/typing';

const OneSignalDataToPath = (notifSource?: ThongBao.TNotificationSource): string => {
	if (!notifSource || !notifSource.entitySource) return '';

	let path = mapUrlNotifSource?.[notifSource.entitySource] ?? '';
	switch (notifSource.entitySource) {
		case ENotificationSource.LOP_HANH_CHINH:
			// TODO: Custom here: Tùy chỉnh link (id, query)...
			break;
		default:
			path = '';
	}
	return path;
};

export default OneSignalDataToPath;
