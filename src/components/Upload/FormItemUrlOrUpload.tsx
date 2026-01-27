import rules from '@/utils/rules';
import { Form, Input, Radio, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import UploadFile from './UploadFile';

/**
 * Form Item cho vào Form cho nhập URL hoặc UPLOAD file
 * @param props
 * @returns
 */
const FormItemUrlOrUpload = (props: {
	form: FormInstance;
	initValue?: any;
	field?: string;
	accept?: string;
	isRequired?: boolean;
	label?: string;
}) => {
	const { form, initValue, isRequired } = props;
	const [typeUpload, setTypeUpload] = useState<'UPLOAD' | 'URL'>('UPLOAD');
	const field = props.field || 'url';
	const accept = props.accept || '.docx, .pdf, .doc';
	const label = props.label || 'Tệp đính kèm';

	useEffect(() => {
		setTypeUpload(!!initValue ? 'URL' : 'UPLOAD');
		form.setFieldsValue({ [field]: initValue }); // Update lại value sau khi upload file
	}, [initValue]);

	return (
		<Form.Item
			name={field}
			label={
				<>
					{label} &nbsp;
					<Radio.Group
						onChange={(e) => {
							setTypeUpload(e.target.value);
							form.setFieldsValue({ [field]: undefined });
						}}
						value={typeUpload}
					>
						<Radio value={'URL'}>Đường dẫn</Radio>
						<Radio value={'UPLOAD'}>Tải lên</Radio>
					</Radio.Group>
				</>
			}
			rules={[
				...(typeUpload === 'UPLOAD' ? [] : rules.httpLink),
				...(isRequired ? (typeUpload === 'UPLOAD' ? rules.fileRequired : rules.required) : []),
			]}
		>
			{typeUpload === 'UPLOAD' ? (
				<UploadFile maxCount={1} otherProps={{ accept }} />
			) : (
				<Input placeholder='Nhập đường dẫn' />
			)}
		</Form.Item>
	);
};

export default FormItemUrlOrUpload;
