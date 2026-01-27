import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import type { AuditLog } from '@/services/TienIch/AuditLog/typing';
import { Button, Card, Descriptions, Modal } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';

const renderSection = (label: string, data: any) => (
	<>
		<div className='fw500' style={{ marginTop: 8 }}>
			{label}:
		</div>
		{data ? <pre>{JSON.stringify(data ?? {}, undefined, 2)}</pre> : null}
	</>
);

const ModalAuditLog = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	actions?: Record<any, string>;
	modelName?: string;
}) => {
	const { visible, setVisible, actions = {}, title = 'Lịch sử thao tác', modelName = 'tienich.auditlog' } = props;
	const { page, limit, getModel, setRecord, record } = useModel(modelName as any);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('50%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () =>
		getModel(undefined, [{ field: 'action', values: Object.keys(actions), operator: EOperatorType.INCLUDE }]).then(
			(res: any) => setRecord(res?.[0]),
		);

	const onCell = (rec: AuditLog.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<AuditLog.IRecord>[] = [
		{ title: 'TT', dataIndex: 'index', align: 'center', width: 60, onCell },
		{
			title: 'Mã người dùng',
			dataIndex: 'uCode',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'uName',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Hành động',
			dataIndex: 'action',
			width: 180,
			filterType: 'select',
			filterData: Object.keys(actions).map((i) => ({ label: actions[i], value: i })),
			render: (val) => val && actions[val],
			onCell,
		},
		{
			title: 'Thời gian',
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm:ss, DD/MM/YYYY'),
			onCell,
		},
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 90,
		// 	fixed: 'right',
		// 	render: (val, rec) => (
		// 		<>
		// 			<ButtonExtend
		// 				tooltip='Chi tiết'
		// 				onClick={() => rec._id && getByIdModel(rec._id).then(handleView)}
		// 				type='link'
		// 				icon={<EyeOutlined />}
		// 			/>
		// 			<ButtonExtend
		// 				tooltip='Cập nhật'
		// 				onClick={() => onCapNhat(rec)}
		// 				className='btn-warning'
		// 				type='link'
		// 				icon={<RetweetOutlined />}
		// 			/>
		// 		</>
		// 	),
		// },
	];

	return (
		<Modal title={title} visible={visible} onCancel={() => setVisible(false)} footer={null} width={1200}>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='30%'>
					<Card
						title='Danh sách thao tác'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0' }}
						headStyle={{ padding: 0 }}
					>
						<TableBase
							columns={columns}
							dependencies={[page, limit]}
							modelName={modelName}
							getData={getData}
							widthDrawer={1000}
							hideCard
							buttons={{ create: false }}
							otherProps={{ size: 'small' }}
							addStt={false}
						/>
					</Card>
				</Pane>

				<Pane minSize='30%'>
					<Card
						title='Chi tiết thao tác'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0', maxHeight: 630, overflowY: 'auto' }}
						headStyle={{ padding: 0 }}
					>
						<Descriptions column={1}>
							<Descriptions.Item label='Mã người dùng'>{record?.uCode ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Họ và tên'>{record?.uName ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ Email'>{record?.uEmail ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Loại hành động'>
								{record?.action ? actions[record?.action] : '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ IP'>{record?.ip ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Trình duyệt/Thiết bị'>{record?.userAgent ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Phương thức truy cập'>{record?.requestType ?? '--'}</Descriptions.Item>
						</Descriptions>

						{renderSection('Dữ liệu', record?.data)}
						{renderSection('Tham số', record?.param)}
						{renderSection('Truy vấn', record?.query)}
						{renderSection('Dữ liệu trả về', record?.response)}
					</Card>
				</Pane>
			</SplitPane>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};

export default ModalAuditLog;
