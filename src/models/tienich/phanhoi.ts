import useInitModel from '@/hooks/useInitModel';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { ipSlink } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', undefined, undefined, ipSlink);

	return {
		...objInit,
	};
};
