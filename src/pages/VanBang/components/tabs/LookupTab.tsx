import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Space, Table } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import type { DiplomaInfo } from '../../types';

interface LookupTabProps {
	searchForm: FormInstance;
	searchResult: DiplomaInfo[];
	onLookup: () => Promise<void>;
	onReset: () => void;
	onViewDetail: (record: DiplomaInfo) => void;
}

const LookupTab: React.FC<LookupTabProps> = ({ searchForm, searchResult, onLookup, onReset, onViewDetail }) => {
	const columns: ColumnsType<DiplomaInfo> = [
		{
			title: 'Số vào sổ',
			dataIndex: 'entryNumber',
			width: 100,
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'diplomaNumber',
			width: 180,
		},
		{
			title: 'MSV',
			dataIndex: 'studentCode',
			width: 120,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			width: 220,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'birthDate',
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Chi tiết',
			width: 100,
			render: (_, record) => (
				<Button type='link' icon={<EyeOutlined />} onClick={() => onViewDetail(record)}>
					Xem
				</Button>
			),
		},
	];

	return (
		<Card>
			<Form form={searchForm} layout='vertical'>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item name='diplomaNumber' label='Số hiệu văn bằng'>
							<Input placeholder='Nhập số hiệu văn bằng' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='entryNumber' label='Số vào sổ'>
							<InputNumber min={1} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='studentCode' label='Mã sinh viên'>
							<Input placeholder='Nhập mã sinh viên' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='fullName' label='Họ tên'>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='birthDate' label='Ngày sinh'>
							<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
				<Space>
					<Button type='primary' onClick={onLookup}>
						Tra cứu
					</Button>
					<Button onClick={onReset}>Đặt lại</Button>
				</Space>
			</Form>
			<Divider />
			<Table rowKey='id' dataSource={searchResult} columns={columns} pagination={{ pageSize: 10 }} />
		</Card>
	);
};

export default LookupTab;
