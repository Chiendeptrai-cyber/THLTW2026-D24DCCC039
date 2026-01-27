import queryString from 'query-string';
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

const CheckOneSignalSubscription = () => {
	/** Gửi message đến trang chính sau khi handle OneSignal */
	const sendMessage = async (isEnable: boolean) => {
		const parsed = queryString.parse(window.location.search);
		// console.log(`2 Mainsite is Sending Message to ${parsed?.source?.toString() ?? ''} ${isEnable}`);
		// postMessage: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
		// && Object.values(AppModules).some((role) => role.url === parsed.source)
		if (parsed.source) window.parent.postMessage(isEnable, parsed.source.toString());
	};

	useEffect(() => {
		window.addEventListener('load', () => {
			OneSignal.isPushNotificationsEnabled((isEnabled) => {
				// console.log(`1 subdomain.site iframe checking subscription from mainsite, it is ${isEnabled}`);
				sendMessage(isEnabled);
			});
		});
	}, []);

	return <>Hello </>;
};

export default CheckOneSignalSubscription;
