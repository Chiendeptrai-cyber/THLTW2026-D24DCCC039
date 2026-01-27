import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import TableStaticData from '../TableStaticData';
import { type IColumn, type TExportField } from '../typing';

const CardExportFields = (props: { fields: TExportField[]; setFields: (val: TExportField[]) => void }) => {
	const { fields, setFields } = props;

	const columns: IColumn<TExportField>[] = [
		{
			title: 'Tên trường',
			width: 180,
			render: (val, rec) => rec.labels.join(' / '),
		},
		{
			title: '',
			width: 30,
			align: 'center',
			render: (val, rec) => (
				<Button
					icon={<DeleteOutlined />}
					type='link'
					danger
					onClick={() => setFields(fields.map((item) => (item._id === rec._id ? { ...item, selected: false } : item)))}
				/>
			),
		},
	];

	const onSortEnd = (record: TExportField, newIndex: number): void => {
		const tmp = fields.filter((item) => item._id !== record._id);
		const newRecord = fields.filter((item) => item.selected)[newIndex];
		const tempIndex = fields.indexOf(newRecord);
		tmp.splice(tempIndex, 0, record);
		setFields(tmp);
	};

	return (
		<Card title='Các trường để trích xuất' bordered={false} bodyStyle={{ padding: 0 }} headStyle={{ padding: 0 }}>
			<TableStaticData
				columns={columns}
				data={fields.filter((item) => item.selected)}
				size='small'
				addStt
				rowSortable
				onSortEnd={onSortEnd}
				otherProps={{ scroll: { y: 380 }, pagination: false }}
			/>
		</Card>
	);
};

export default CardExportFields;
