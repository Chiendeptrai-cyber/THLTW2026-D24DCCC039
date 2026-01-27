import { TenVaiTroKhaoSat, EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { Space, Tag } from 'antd';
import _ from 'lodash';
const { CheckableTag } = Tag;

const GroupTagVaiTro = (props: {
	value?: EVaiTroKhaoSat[];
	onChange?: (arr: EVaiTroKhaoSat[]) => void;
	listVaiTro?: EVaiTroKhaoSat[];
	disabled?: boolean;
}) => {
	const { value, onChange, disabled } = props;
	const listVaiTro = props.listVaiTro ?? Object.values(EVaiTroKhaoSat);

	const handleChange = (val: EVaiTroKhaoSat, checked: boolean) => {
		if (disabled) {
			return;
		}
		if (!checked) {
			const newVal = value?.filter((i) => i !== val) ?? [];
			if (onChange) onChange(newVal);
		} else {
			const find = value?.find((i) => i === val);
			if (!find && onChange) {
				const newVal = [...(value ?? []), val];
				onChange(newVal);
			}
		}
	};

	return (
		<Space wrap size={8} className='lich-tuan-list'>
			{listVaiTro.map((item) => (
				<CheckableTag
					key={item}
					checked={value?.includes(item) || false}
					onChange={(checked) => handleChange(item, checked)}
					style={{ pointerEvents: disabled ? 'none' : undefined }}
				>
					{TenVaiTroKhaoSat[item]}
				</CheckableTag>
			))}
		</Space>
	);
};

export default GroupTagVaiTro;
