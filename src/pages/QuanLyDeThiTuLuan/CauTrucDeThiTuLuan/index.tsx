import React, { useState } from 'react';
import {
	Button,
	Table,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	message,
	Space,
	Popconfirm,
	Card,
	Row,
	Col,
	Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { TestPaperTemplate, TestPaperQuestionConfig, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS } from '@/types/exam';

const mockSubjects = [
	{ id: '1', code: 'CS101', name: 'Lập trình cơ bản' },
	{ id: '2', code: 'CS201', name: 'Cấu trúc dữ liệu' },
];

const mockKnowledgeBlocks = [
	{ id: '1', name: 'Tổng quan' },
	{ id: '2', name: 'Chuyên sâu' },
];

const CauTrucDeThiTuLuan: React.FC = () => {
	const [templates, setTemplates] = useState<TestPaperTemplate[]>([
		{
			id: '1',
			subjectId: '1',
			name: 'Cấu trúc đề cơ bản',
			description: 'Cấu trúc đề thi cơ bản cho lập trình cơ bản',
			questionConfigs: [
				{ knowledgeBlockId: '1', difficulty: 'easy', quantity: 2 },
				{ knowledgeBlockId: '1', difficulty: 'medium', quantity: 2 },
				{ knowledgeBlockId: '2', difficulty: 'hard', quantity: 1 },
			],
			totalQuestions: 5,
			createdAt: new Date().toISOString(),
		},
	]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTemplate, setEditingTemplate] = useState<TestPaperTemplate | null>(null);
	const [form] = Form.useForm();
	const [configs, setConfigs] = useState<TestPaperQuestionConfig[]>([]);

	const handleAddTemplate = () => {
		setEditingTemplate(null);
		form.resetFields();
		setConfigs([]);
		setIsModalVisible(true);
	};

	const handleEditTemplate = (template: TestPaperTemplate) => {
		setEditingTemplate(template);
		form.setFieldsValue({
			subjectId: template.subjectId,
			name: template.name,
			description: template.description,
		});
		setConfigs(template.questionConfigs);
		setIsModalVisible(true);
	};

	const handleDeleteTemplate = (id: string) => {
		setTemplates(templates.filter((t) => t.id !== id));
		message.success('Xóa cấu trúc đề thi thành công');
	};

	const handleAddConfig = () => {
		setConfigs([
			...configs,
			{
				knowledgeBlockId: '1',
				difficulty: 'easy',
				quantity: 1,
			},
		]);
	};

	const handleUpdateConfig = (index: number, updatedConfig: TestPaperQuestionConfig) => {
		const newConfigs = [...configs];
		newConfigs[index] = updatedConfig;
		setConfigs(newConfigs);
	};

	const handleRemoveConfig = (index: number) => {
		setConfigs(configs.filter((_, i) => i !== index));
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (configs.length === 0) {
				message.error('Vui lòng thêm ít nhất một cấu hình câu hỏi');
				return;
			}

			const totalQuestions = configs.reduce((sum, c) => sum + c.quantity, 0);

			if (editingTemplate) {
				setTemplates(
					templates.map((t) =>
						t.id === editingTemplate.id
							? {
									...t,
									subjectId: values.subjectId,
									name: values.name,
									description: values.description,
									questionConfigs: configs,
									totalQuestions,
							  }
							: t,
					),
				);
				message.success('Cập nhật cấu trúc đề thi thành công');
			} else {
				const newTemplate: TestPaperTemplate = {
					id: Date.now().toString(),
					subjectId: values.subjectId,
					name: values.name,
					description: values.description,
					questionConfigs: configs,
					totalQuestions,
					createdAt: new Date().toISOString(),
				};
				setTemplates([...templates, newTemplate]);
				message.success('Thêm cấu trúc đề thi thành công');
			}
			setIsModalVisible(false);
			form.resetFields();
			setConfigs([]);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const columns = [
		{
			title: 'STT',
			width: 50,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: 'Tên cấu trúc',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			render: (subjectId: string) => {
				const subject = mockSubjects.find((s) => s.id === subjectId);
				return subject ? `${subject.code} - ${subject.name}` : '-';
			},
		},
		{
			title: 'Tổng câu hỏi',
			dataIndex: 'totalQuestions',
			key: 'totalQuestions',
			width: 100,
			render: (total: number) => <Tag color='blue'>{total}</Tag>,
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
			render: (_text: any, record: TestPaperTemplate) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEditTemplate(record)} />
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn có chắc chắn muốn xóa cấu trúc này?'
						onConfirm={() => handleDeleteTemplate(record.id)}
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
				<h2>Quản lý cấu trúc đề thi</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAddTemplate}>
					Thêm cấu trúc đề thi
				</Button>
			</div>

			<Table dataSource={templates} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingTemplate ? 'Chỉnh sửa cấu trúc đề thi' : 'Thêm cấu trúc đề thi'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={900}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{mockSubjects.map((s) => (
								<Select.Option key={s.id} value={s.id}>
									{s.code} - {s.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='name'
						label='Tên cấu trúc'
						rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc' }]}
					>
						<Input placeholder='VD: Cấu trúc đề cơ bản' />
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea placeholder='Mô tả cấu trúc' rows={2} />
					</Form.Item>

					{/* Cấu hình câu hỏi */}
					<Card style={{ marginBottom: 16 }}>
						<h4>Cấu hình câu hỏi (Tổng: {configs.reduce((sum, c) => sum + c.quantity, 0)} câu)</h4>
						<div style={{ marginBottom: 16 }}>
							<Button icon={<PlusCircleOutlined />} onClick={handleAddConfig} block>
								Thêm cấu hình
							</Button>
						</div>

						{configs.map((config, index) => (
							<Row key={index} gutter={16} style={{ marginBottom: 12 }}>
								<Col xs={24} sm={8}>
									<Select
										placeholder='Chọn khối kiến thức'
										value={config.knowledgeBlockId}
										onChange={(value) =>
											handleUpdateConfig(index, {
												...config,
												knowledgeBlockId: value,
											})
										}
									>
										{mockKnowledgeBlocks.map((b) => (
											<Select.Option key={b.id} value={b.id}>
												{b.name}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col xs={24} sm={8}>
									<Select
										placeholder='Chọn độ khó'
										value={config.difficulty}
										onChange={(value) =>
											handleUpdateConfig(index, {
												...config,
												difficulty: value,
											})
										}
									>
										{DIFFICULTY_OPTIONS.map((d) => (
											<Select.Option key={d.value} value={d.value}>
												{d.label}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col xs={24} sm={6}>
									<InputNumber
										min={1}
										value={config.quantity}
										onChange={(value) =>
											handleUpdateConfig(index, {
												...config,
												quantity: value || 1,
											})
										}
										placeholder='Số lượng'
										style={{ width: '100%' }}
									/>
								</Col>
								<Col xs={24} sm={2}>
									<Button danger onClick={() => handleRemoveConfig(index)} block>
										Xóa
									</Button>
								</Col>
							</Row>
						))}
					</Card>
				</Form>
			</Modal>
		</Card>
	);
};

export default CauTrucDeThiTuLuan;
