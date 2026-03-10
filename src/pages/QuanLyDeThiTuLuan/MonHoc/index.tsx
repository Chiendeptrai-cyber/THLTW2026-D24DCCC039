import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, message, Space, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject } from '@/types/exam';

const MonHoc: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([
		{
			id: '1',
			code: 'CS101',
			name: 'Lập trình cơ bản',
			credits: 3,
			description: 'Môn học nhập môn lập trình',
			createdAt: new Date().toISOString(),
		},
		{
			id: '2',
			code: 'CS201',
			name: 'Cấu trúc dữ liệu',
			credits: 4,
			description: 'Môn học về cấu trúc dữ liệu và thuật toán',
			createdAt: new Date().toISOString(),
		},
	]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	const handleAddSubject = () => {
		setEditingSubject(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEditSubject = (subject: Subject) => {
		setEditingSubject(subject);
		form.setFieldsValue({
			code: subject.code,
			name: subject.name,
			credits: subject.credits,
			description: subject.description,
		});
		setIsModalVisible(true);
	};

	const handleDeleteSubject = (id: string) => {
		setSubjects(subjects.filter((s) => s.id !== id));
		message.success('Xóa môn học thành công');
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (editingSubject) {
				setSubjects(
					subjects.map((s) =>
						s.id === editingSubject.id
							? {
									...s,
									code: values.code,
									name: values.name,
									credits: values.credits,
									description: values.description,
							  }
							: s,
					),
				);
				message.success('Cập nhật môn học thành công');
			} else {
				const newSubject: Subject = {
					id: Date.now().toString(),
					code: values.code,
					name: values.name,
					credits: values.credits,
					description: values.description,
					createdAt: new Date().toISOString(),
				};
				setSubjects([...subjects, newSubject]);
				message.success('Thêm môn học thành công');
			}
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const columns = [
		{
			title: 'STT',
			width: 60,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: 'Mã môn',
			dataIndex: 'code',
			key: 'code',
			width: 100,
		},
		{
			title: 'Tên môn học',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'credits',
			key: 'credits',
			width: 100,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			render: (_text: any, record: Subject) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEditSubject(record)} />
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn có chắc chắn muốn xóa môn học này?'
						onConfirm={() => handleDeleteSubject(record.id)}
					>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<div style={{ marginBottom: 20 }}>
				<h2>Quản lý môn học</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAddSubject}>
					Thêm môn học
				</Button>
			</div>

			<Table dataSource={subjects} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingSubject ? 'Chỉnh sửa môn học' : 'Thêm môn học'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='code' label='Mã môn học' rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}>
						<Input placeholder='VD: CS101' />
					</Form.Item>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}>
						<Input placeholder='VD: Lập trình cơ bản' />
					</Form.Item>
					<Form.Item
						name='credits'
						label='Số tín chỉ'
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
					>
						<InputNumber min={1} placeholder='VD: 3' />
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea placeholder='Mô tả về môn học' rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default MonHoc;
