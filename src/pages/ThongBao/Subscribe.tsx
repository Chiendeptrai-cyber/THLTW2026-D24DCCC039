import { initOneSignal } from '@/services/base/api';
import { unitName } from '@/services/base/constant';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';

const SubscribeOneSignal = () => {
	const auth = useAuth();

	useEffect(() => {
		document.title = `Đăng ký nhận thông báo | ${unitName.toUpperCase()}`;
	}, []);

	/**
	 * Init OneSignal playerId with auth User
	 */
	useEffect(() => {
		if (auth.user?.access_token)
			OneSignal.getUserId().then((playerId) => {
				// Init playerId to Back-end and Close popup window
				if (playerId)
					initOneSignal({ playerId }).then(() => {
						window.opener = null;
						window.open('', '_self');
						window.close();
					});
			});
	}, [auth.user?.access_token]);

	// TODO: Update UI
	return <div>SubscribeOneSignal</div>;
};

export default SubscribeOneSignal;
