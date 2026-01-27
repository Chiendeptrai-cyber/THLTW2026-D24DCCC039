import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'antd/es/date-picker/style/index.less';
import type { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import type { Moment } from 'moment';
import moment from 'moment';

const MyDateRangePicker = (
	props: Omit<RangePickerProps<Moment>, 'onChange'> & {
		/**
		 * Format hiển thị, mặc định: DD/MM/YYYY
		 */
		format?: string;
		showTime?:
			| boolean
			| {
					format?: string;
					showNow?: boolean;
					showHour?: boolean;
					showMinute?: boolean;
					showSecond?: boolean;
					use12Hours?: boolean;
					hourStep?: number;
					minuteStep?: number;
					secondStep?: number;
			  };
		allowClear?: boolean;
		disabled?: boolean;

		/**
		 * Format lưu lại, mặc định: ISOString
		 */
		saveFormat?: string;
		disabledDate?: (cur: string) => any;
		onChange?: (arg: [string, string] | null) => any;
	},
) => {
	const format = props?.format ?? 'DD/MM/YYYY';
	const { saveFormat, disabledDate, showTime, allowClear, disabled } = props;

	const handleChange = (value: [Moment, Moment] | null) => {
		if (value) {
			const nextValue = saveFormat
				? value.map((item) => item.format(props?.saveFormat))
				: value.map((item) => item.toISOString());
			props.onChange?.(nextValue as [string, string]);
		} else {
			props.onChange?.(null);
		}
	};

	let objMoment: any = undefined;
	if (props.value && typeof props.value.every((item) => typeof item === 'string')) {
		objMoment = props.value.map((item) => {
			return moment(item, saveFormat);
		});
	} else objMoment = props?.value;

	return (
		<DatePicker.RangePicker
			style={{ width: '100%' }}
			{...props}
			format={format}
			locale={locale}
			value={objMoment}
			onChange={handleChange as any}
			disabledDate={disabledDate}
			showTime={showTime}
			allowClear={allowClear}
			disabled={disabled}
		/>
	);
};

export default MyDateRangePicker;
