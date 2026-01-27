import rules from '@/utils/rules';
import { Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import MyDatePicker from '../MyDatePicker';
import { EOperatorType, OperatorLabel } from './constant';
import { type IColumn, type TDataOption, type TFilter } from './typing';

const RowFilter = (props: {
	index: number;
	columns: IColumn<any>[];
	filter: TFilter<any>;
	onChange: (filter: TFilter<any>) => void;
	fieldsFilterable: string[];
}) => {
	const { index, columns, filter, onChange, fieldsFilterable } = props;
	const [operators, setOperators] = useState<EOperatorType[]>([]);
	const filterColumn = columns.find((item) => JSON.stringify(item.dataIndex) === JSON.stringify(filter.field));
	const filterType = filterColumn?.filterType;

	useEffect(() => {
		let opers: EOperatorType[];
		switch (filterType) {
			case 'string':
				opers = [
					EOperatorType.CONTAIN,
					EOperatorType.NOT_CONTAIN,
					EOperatorType.START_WITH,
					EOperatorType.END_WITH,
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
				];
				break;
			case 'number':
			case 'date':
			case 'datetime':
				opers = [
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
					EOperatorType.LESS_THAN,
					EOperatorType.LESS_EQUAL,
					EOperatorType.GREAT_THAN,
					EOperatorType.GREAT_EQUAL,
					EOperatorType.BETWEEN,
					EOperatorType.NOT_BETWEEN,
				];
				break;
			case 'select':
			case 'customselect':
				opers = [EOperatorType.INCLUDE, EOperatorType.NOT_INCLUDE];
				break;

			default:
				opers = [];
				break;
		}
		setOperators(opers);
		const temp = { ...filter };
		temp.operator = opers?.[0];
		onChange(temp);
	}, [filterType]);

	const renderDataComponent = () => {
		switch (filterType) {
			case 'string':
				return <Input placeholder='Giá trị' />;
			case 'date':
				return <MyDatePicker />;
			case 'datetime':
				return <MyDatePicker format='DD/MM/YYYY HH:mm' showTime />;
			case 'number':
				return <InputNumber style={{ width: '100%' }} placeholder='Giá trị' />;
			case 'select':
				return (
					<Select
						options={filterColumn?.filterData?.map((item: string | TDataOption) =>
							typeof item === 'string'
								? { key: item, value: item, label: item }
								: { key: item.value, value: item.value, label: item.label },
						)}
						mode='multiple'
						optionFilterProp='label'
						placeholder='Chọn giá trị'
						showArrow
						showSearch
					/>
				);
			case 'customselect':
				return filterColumn?.filterCustomSelect;

			default:
				return <></>;
		}
	};

	return (
		<Space align='center' className='filter-item-space'>
			<Form.Item name={['filters', index, 'active']} valuePropName='checked' initialValue={true}>
				<Checkbox />
			</Form.Item>

			<Row gutter={[8, 0]}>
				<Col span={24} md={12}>
					<Form.Item rules={[...rules.required]}>
						<Select
							options={columns
								.filter(
									(item) =>
										fieldsFilterable.includes(JSON.stringify(item.dataIndex)) ||
										JSON.stringify(item.dataIndex) === JSON.stringify(filter.field),
								)
								.map((item) => ({
									key: item.dataIndex?.toString() ?? '',
									value: Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex?.toString() ?? '',
									label: item.title,
								}))}
							value={Array.isArray(filter.field) ? filter.field.join('.') : filter.field?.toString()}
							onChange={(val: string) => {
								const temp = { ...filter };
								temp.field = val;
								onChange(temp);
							}}
							placeholder='Thuộc tính'
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item rules={[...rules.required]}>
						<Select
							options={operators.map((item) => ({
								key: item,
								value: item,
								label: OperatorLabel[item],
							}))}
							value={filter.operator}
							onChange={(val: EOperatorType) => {
								const temp = { ...filter };
								temp.operator = val;
								onChange(temp);
							}}
							placeholder='Điều kiện'
						/>
					</Form.Item>
				</Col>

				{!!filter.operator ? (
					<>
						<Col
							span={24}
							md={filter.operator === EOperatorType.BETWEEN || filter.operator === EOperatorType.NOT_BETWEEN ? 12 : 24}
						>
							<Form.Item
								name={
									filter.operator === EOperatorType.INCLUDE || filter.operator === EOperatorType.NOT_INCLUDE
										? ['filters', index, 'values']
										: ['filters', index, 'values', 0]
								}
								rules={[...rules.required]}
							>
								{renderDataComponent()}
							</Form.Item>
						</Col>

						{filter.operator === EOperatorType.BETWEEN || filter.operator === EOperatorType.NOT_BETWEEN ? (
							<Col span={24} md={12}>
								<Form.Item name={['filters', index, 'values', 1]} rules={[...rules.required]}>
									{renderDataComponent()}
								</Form.Item>
							</Col>
						) : null}
					</>
				) : null}
			</Row>
		</Space>
	);
};

export default RowFilter;
