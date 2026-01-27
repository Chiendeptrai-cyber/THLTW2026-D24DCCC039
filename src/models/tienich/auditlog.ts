import useInitModel from '@/hooks/useInitModel';
import type { AuditLog } from '@/services/TienIch/AuditLog/typing';

export default () => {
	const objInit = useInitModel<AuditLog.IRecord>('audit-log');

	return {
		...objInit,
	};
};
