import { createSetting, getByKey, getSettingByKey, putSetting, updateSetting } from '@/services/base/api';
import type { ESettingKey } from '@/services/base/constant';
import type { ISetting } from '@/services/base/typing';
import { message } from 'antd';
import { useState } from 'react';

type TSettingType = Partial<{
	[ESettingKey.KEY]: any; // Some type has `_id`
}>;

export default () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [settings, setSettings] = useState<TSettingType>({});

	const getByKeyModel = async (key: ESettingKey, ip?: string): Promise<any> => {
		if (settings[key]) return settings[key];
		setLoading(true);
		try {
			const res = await getSettingByKey(key, ip);
			const temp = Object.assign(settings, { [key]: res.data?.data });
			setSettings(temp);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const updateSettingModel = async (data: ISetting, ip?: string): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await putSetting(data, ip);
			const temp = Object.assign(settings, { [data.key]: data.value });
			setSettings(temp);
			message.success('Cập nhật thành công');

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getByKeyBaseModel = async (key: ESettingKey, ip?: string): Promise<any> => {
		if (settings[key]) return settings[key];
		setLoading(true);
		try {
			const response = await getByKey(key, ip);
			const data = response?.data?.data;
			const value = response?.data?.data?.value ?? {};
			value._id = data?._id;
			setSettings(Object.assign(settings, { [key]: value }));

			return value;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const updateSettingBaseModel = async (payload: { key: ESettingKey; value: any; noNotif?: boolean }, ip?: string) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const _id = settings[payload.key]?._id;
			if (_id) {
				await updateSetting(_id, payload, ip);
			} else {
				await createSetting(payload, ip);
			}
			setSettings((set) => {
				set[payload.key] = { ...set[payload.key], ...payload.value };
				return set;
			});
			if (!payload?.noNotif) message.success('Lưu thành công');
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		loading,
		setLoading,
		formSubmiting,
		setFormSubmiting,
		settings,
		setSettings,
		getByKeyModel,
		updateSettingModel,
		getByKeyBaseModel,
		updateSettingBaseModel,
	};
};
