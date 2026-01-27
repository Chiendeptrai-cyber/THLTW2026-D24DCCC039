import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'antd/es/date-picker/style/index.less';
import type { PickerProps } from 'antd/lib/date-picker/generatePicker';
import type { Moment } from 'moment';
import moment from 'moment';

const MyDatePicker = (
  props: Omit<PickerProps<Moment>, 'onChange'> & {
    /**
     * Format hiển thị, mặc định: DD/MM/YYYY
     */
    format?: string;
    pickerStyle?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
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
    onChange?: (arg: string | null) => any;
  },
) => {
  const format = props?.format ?? 'DD/MM/YYYY';
  const { saveFormat, pickerStyle, disabledDate, showTime, allowClear, disabled } = props;

  const handleChange = (value: Moment | null) => {
    if (props.onChange)
      if (value)
        props.onChange(saveFormat ? value?.format(props?.saveFormat) : value.toISOString());
      else props.onChange(null);
  };

  let objMoment: any = undefined;
  if (props.value && typeof props.value == 'string') objMoment = moment(props.value, saveFormat);
  else objMoment = props?.value;

  return (
    <DatePicker
      style={{ width: '100%' }}
      {...props}
      format={format}
      picker={pickerStyle}
      locale={locale}
      value={objMoment}
      onChange={handleChange}
      disabledDate={disabledDate}
      showTime={showTime}
      allowClear={allowClear}
      disabled={disabled}
    />
  );
};

export default MyDatePicker;
