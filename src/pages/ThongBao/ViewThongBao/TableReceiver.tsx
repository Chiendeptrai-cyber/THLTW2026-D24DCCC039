import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ThongBao } from '@/services/ThongBao/typing';
import { Select, Tag } from 'antd';
import { useModel } from 'umi';
import { thongKeNotificationNguoiNhan } from '@/services/ThongBao';
import { useEffect, useState } from 'react';

const TableReceiverThongBao = (props: { record?: ThongBao.IRecord }) => {
	const { page, limit, getModel } = useModel('thongbao.receiver');
	const { record } = props;
	const [dataThongKeNguoiNhan, setDataThongKeNguoiNhan] = useState<ThongBao.IThongKeNguoiNhan>();
	const [trangThaiSelect, setTrangThaiSelect] = useState<number>();
	const getData = () =>
		record?._id &&
		getModel(undefined, undefined, undefined, undefined, undefined, `${record._id}/receiver/page`, {
			read: trangThaiSelect,
		});
	const thongKeNguoiNhan = async (id: string) => {
		try {
			const res = await thongKeNotificationNguoiNhan(id);
			if (res) {
				setDataThongKeNguoiNhan(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const columns: IColumn<ThongBao.TReceiver>[] = [
		{
			title: 'Mã giảng viên / sinh viên',
			dataIndex: 'username',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'read',
			width: 100,
			align: 'center',
			render: (val) => {
				return <>{val ? <Tag color={'green'}>Đã đọc</Tag> : <Tag color={'red'}>Chưa đọc</Tag>}</>;
			},
		},
	];

	useEffect(() => {
		if (record?._id) thongKeNguoiNhan(record?._id ?? '');
	}, [record]);
	return (
		<>
			<TableBase
				columns={columns}
				modelName='thongbao.receiver'
				getData={getData}
				dependencies={[page, limit, record?._id, trangThaiSelect]}
				hideCard
				buttons={{ create: false }}
				otherButtons={[
					<Select
						key={'1'}
						placeholder={'Chọn trạng thái'}
						onChange={(val) => {
							setTrangThaiSelect(val);
						}}
						allowClear
						style={{ width: 160 }}
						options={[
							{ value: 1, label: 'Đã đọc' },
							{ value: 0, label: 'Chưa đọc' },
						]}
					/>,
				]}
			>
				{dataThongKeNguoiNhan && (
					<div style={{ marginBottom: 16 }}>
						Tỉ lệ :{' '}
						<b>
							{dataThongKeNguoiNhan?.daDoc}/{+dataThongKeNguoiNhan?.daDoc + +dataThongKeNguoiNhan?.chuaDoc}
						</b>{' '}
						{dataThongKeNguoiNhan?.daDoc > 0 && dataThongKeNguoiNhan?.chuaDoc > 0 ? (
							<>
								(
								{(
									(dataThongKeNguoiNhan?.daDoc / (+dataThongKeNguoiNhan?.daDoc + +dataThongKeNguoiNhan?.chuaDoc)) *
									100
								).toFixed(2)}
								% đã đọc thông báo)
							</>
						) : (
							'(0% đã đọc thông báo)'
						)}
					</div>
				)}
			</TableBase>
		</>
	);
};

export default TableReceiverThongBao;
