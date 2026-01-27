import rules from '@/utils/rules';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { type TImportHeader } from '../typing';

const MatchColumns = (props: { onChange: () => void; onBack: any; importHeaders: TImportHeader[] }) => {
	const { onChange, onBack, importHeaders } = props;
	const { headLine, matchedColumns, setMatchedColumns } = useModel('import');
	const [form] = Form.useForm();
	const fileTitles = Object.values(headLine ?? {}); // Các tiêu đề cột lấy từ file

	useEffect(() => {
		if (matchedColumns) form.setFieldsValue(matchedColumns);
	}, []);

	const onFinish = (values: any): void => {
		setMatchedColumns(values);
		if (onChange) onChange();
	};

	return (
		<Form layout='vertical' form={form} onFinish={onFinish}>
			<Row gutter={[12, 0]}>
				<Col span={24} className='fw500' style={{ marginBottom: 12 }}>
					Ghép cột thông tin với cột dữ liệu tương ứng
				</Col>
				{importHeaders?.map((col) => (
					<Col span={24} md={12} key={col.field}>
						<Form.Item
							name={col.field}
							label={col.label}
							rules={[...(col.required ? rules.required : [])]}
							initialValue={fileTitles.includes(col.label) ? col.label : undefined}
						>
							<Select
								options={Object.entries(headLine ?? {}).map(([colName, title]) => ({
									value: title,
									key: colName,
									label: `Cột ${colName}: ${title}`,
								}))}
								style={{ width: '100%' }}
								allowClear={!col.required}
								placeholder='Cột thông tin trên tập dữ liệu'
								optionFilterProp='label'
								showSearch
							/>
						</Form.Item>
					</Col>
				))}
				<Col span={24}>
					<i style={{ color: 'red' }}>
						Các trường có đánh dấu * là bắt buộc. Ngoài ra các trường khác có thể bỏ qua nếu không có dữ liệu
					</i>
				</Col>

				<Col span={24}>
					<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
						<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
							Quay lại
						</Button>
						<Button htmlType='submit' type='primary'>
							Tiếp theo <ArrowRightOutlined />
						</Button>
					</Space>
				</Col>
			</Row>
		</Form>
	);
};

export default MatchColumns;
