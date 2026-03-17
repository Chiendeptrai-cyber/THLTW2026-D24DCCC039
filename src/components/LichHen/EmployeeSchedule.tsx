import React from 'react';
import { Table, Tag } from 'antd';
import type { WorkSchedule } from '@/types/lichhen';
import type { ColumnsType } from 'antd/es/table';

interface EmployeeScheduleProps {
	workSchedules: WorkSchedule[];
}

const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const EmployeeSchedule: React.FC<EmployeeScheduleProps> = ({ workSchedules }) => {
	const columns: ColumnsType<WorkSchedule> = [
		{
			title: 'Thứ',
			dataIndex: 'dayOfWeek',
			key: 'dayOfWeek',
			render: (dayOfWeek) => dayLabels[dayOfWeek] || `Thứ ${dayOfWeek}`,
		},
		{
			title: 'Giờ bắt đầu',
			dataIndex: 'startTime',
			key: 'startTime',
		},
		{
			title: 'Giờ kết thúc',
			dataIndex: 'endTime',
			key: 'endTime',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isWorking',
			key: 'isWorking',
			render: (isWorking) => <Tag color={isWorking ? 'green' : 'red'}>{isWorking ? 'Làm việc' : 'Nghỉ'}</Tag>,
		},
	];

	return <Table columns={columns} dataSource={workSchedules} pagination={false} rowKey='id' size='small' />;
};

export default EmployeeSchedule;
