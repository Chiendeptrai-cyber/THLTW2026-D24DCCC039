import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, Space, Popconfirm, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Question, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS } from '@/types/exam';

// Mock data
const mockSubjects = [
	{ id: '1', code: 'CS101', name: 'Lập trình cơ bản' },
	{ id: '2', code: 'CS201', name: 'Cấu trúc dữ liệu' },
];

const mockKnowledgeBlocks = [
	{ id: '1', name: 'Tổng quan' },
	{ id: '2', name: 'Chuyên sâu' },
];

const CauHoi: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([
		{
			id: '1',
			subjectId: '1',
			code: 'Q001',
			content: 'Giải thích khái niệm biến và cách sử dụng trong lập trình',
			difficulty: 'easy',
			knowledgeBlockId: '1',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
	const [form] = Form.useForm();

	// Filter state
	const [filters, setFilters] = useState({
		subjectId: undefined,
		difficulty: undefined,
		knowledgeBlockId: undefined,
	});

	const filteredQuestions = questions.filter((q) => {
		if (filters.subjectId && q.subjectId !== filters.subjectId) return false;
		if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
		if (filters.knowledgeBlockId && q.knowledgeBlockId !== filters.knowledgeBlockId) return false;
		return true;
	});

	const handleAddQuestion = () => {
		setEditingQuestion(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEditQuestion = (question: Question) => {
		setEditingQuestion(question);
		form.setFieldsValue({
			code: question.code,
			subjectId: question.subjectId,
			content: question.content,
			difficulty: question.difficulty,
			knowledgeBlockId: question.knowledgeBlockId,
		});
		setIsModalVisible(true);
	};

	const handleDeleteQuestion = (id: string) => {
		setQuestions(questions.filter((q) => q.id !== id));
		message.success('Xóa câu hỏi thành công');
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (editingQuestion) {
				setQuestions(
					questions.map((q) =>
						q.id === editingQuestion.id
							? {
									...q,
									code: values.code,
									subjectId: values.subjectId,
									content: values.content,
									difficulty: values.difficulty,
									knowledgeBlockId: values.knowledgeBlockId,
									updatedAt: new Date().toISOString(),
							  }
							: q,
					),
				);
				message.success('Cập nhật câu hỏi thành công');
			} else {
				const newQuestion: Question = {
					id: Date.now().toString(),
					code: values.code,
					subjectId: values.subjectId,
					content: values.content,
					difficulty: values.difficulty,
					knowledgeBlockId: values.knowledgeBlockId,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				setQuestions([...questions, newQuestion]);
				message.success('Thêm câu hỏi thành công');
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
			width: 50,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: 'Mã',
			dataIndex: 'code',
			key: 'code',
			width: 80,
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			width: 150,
			render: (subjectId: string) => {
				const subject = mockSubjects.find((s) => s.id === subjectId);
				return subject ? `${subject.code} - ${subject.name}` : '-';
			},
		},
		{
			title: 'Độ khó',
			dataIndex: 'difficulty',
			key: 'difficulty',
			width: 100,
			render: (difficulty: string) => DIFFICULTY_LABELS[difficulty as any],
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'knowledgeBlockId',
			key: 'knowledgeBlockId',
			width: 120,
			render: (blockId: string) => {
				const block = mockKnowledgeBlocks.find((b) => b.id === blockId);
				return block ? block.name : '-';
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			render: (_text: any, record: Question) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEditQuestion(record)} />
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn có chắc chắn muốn xóa câu hỏi này?'
						onConfirm={() => handleDeleteQuestion(record.id)}
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
				<h2>Quản lý câu hỏi</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAddQuestion}>
					Thêm câu hỏi
				</Button>
			</div>

			{/* Filter Section */}
			<Card style={{ marginBottom: 20, backgroundColor: '#f5f5f5' }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Chọn môn học'
							allowClear
							options={[
								{ label: 'Tất cả', value: undefined },
								...mockSubjects.map((s) => ({
									label: `${s.code} - ${s.name}`,
									value: s.id,
								})),
							]}
							onChange={(value) => setFilters({ ...filters, subjectId: value })}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Chọn độ khó'
							allowClear
							options={[
								{ label: 'Tất cả', value: undefined },
								...DIFFICULTY_OPTIONS.map((d) => ({
									label: d.label,
									value: d.value,
								})),
							]}
							onChange={(value) => setFilters({ ...filters, difficulty: value })}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Chọn khối kiến thức'
							allowClear
							options={[
								{ label: 'Tất cả', value: undefined },
								...mockKnowledgeBlocks.map((b) => ({
									label: b.name,
									value: b.id,
								})),
							]}
							onChange={(value) => setFilters({ ...filters, knowledgeBlockId: value })}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Button icon={<SearchOutlined />} block>
							Tìm kiếm
						</Button>
					</Col>
				</Row>
			</Card>

			<Table
				dataSource={filteredQuestions}
				columns={columns}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={700}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='code' label='Mã câu hỏi' rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi' }]}>
						<Input placeholder='VD: Q001' />
					</Form.Item>
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
						name='content'
						label='Nội dung câu hỏi'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
					>
						<Input.TextArea placeholder='Nhập nội dung câu hỏi' rows={4} />
					</Form.Item>
					<Form.Item
						name='difficulty'
						label='Mức độ khó'
						rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
					>
						<Select placeholder='Chọn mức độ khó'>
							{DIFFICULTY_OPTIONS.map((d) => (
								<Select.Option key={d.value} value={d.value}>
									{d.label}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='knowledgeBlockId'
						label='Khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
					>
						<Select placeholder='Chọn khối kiến thức'>
							{mockKnowledgeBlocks.map((b) => (
								<Select.Option key={b.id} value={b.id}>
									{b.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default CauHoi;
