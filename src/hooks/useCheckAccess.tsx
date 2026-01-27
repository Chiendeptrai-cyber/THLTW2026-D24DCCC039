import { useModel } from 'umi';

const useCheckAccess = (code: string): boolean => {
	const { initialState } = useModel('@@initialState');
	const scopes = initialState?.authorizedPermissions?.flatMap((item) => item.scopes);

	return scopes?.includes(code) || false;
};

export default useCheckAccess;
