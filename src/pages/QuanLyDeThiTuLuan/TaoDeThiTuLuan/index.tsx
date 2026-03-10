import React, { useState } from 'react';
import {
	Button,
	Card,
	Form,
	Select,
	InputNumber,
	message,
	Table,
	Row,
	Col,
	Result,
	Tag,
	Divider,
	Radio,
} from 'antd';
import { PlusOutlined, FileTextOutlined, CheckOutlined } from '@ant-design/icons';
import { TestPaperQuestionConfig, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS, TestPaper, DifficultyLevel } from '@/types/exam';
import useTestPapers from '@/models/testpapers';
import { history } from 'umi';

// Mock data
const mockSubjects = [
	{ id: '1', code: 'CS101', name: 'Lập trình cơ bản' },
	{ id: '2', code: 'CS201', name: 'Cấu trúc dữ liệu' },
];

const mockKnowledgeBlocks = [
	{ id: '1', name: 'Tổng quan' },
	{ id: '2', name: 'Chuyên sâu' },
];

const mockTemplates = [
	{
		id: '1',
		subjectId: '1',
		name: 'Cấu trúc đề cơ bản',
		questionConfigs: [
			{ knowledgeBlockId: '1', difficulty: 'easy', quantity: 2 },
			{ knowledgeBlockId: '1', difficulty: 'medium', quantity: 2 },
			{ knowledgeBlockId: '2', difficulty: 'hard', quantity: 1 },
		],
	},
];

// Mock available questions
const mockQuestions = [
	{
		id: '1',
		code: 'Q001',
		content: 'Giải thích khái niệm biến',
		subjectId: '1',
		knowledgeBlockId: '1',
		difficulty: 'easy',
	},
	{
		id: '2',
		code: 'Q002',
		content: 'Phân tích vòng lặp for',
		subjectId: '1',
		knowledgeBlockId: '1',
		difficulty: 'easy',
	},
	{
		id: '3',
		code: 'Q003',
		content: 'Trình bày cách hoạt động của hàm',
		subjectId: '1',
		knowledgeBlockId: '1',
		difficulty: 'medium',
	},
	{
		id: '4',
		code: 'Q004',
		content: 'Phân tích các kiểu dữ liệu cơ bản',
		subjectId: '1',
		knowledgeBlockId: '1',
		difficulty: 'medium',
	},
	{
		id: '5',
		code: 'Q005',
		content: 'Thiết kế giải pháp tối ưu',
		subjectId: '1',
		knowledgeBlockId: '2',
		difficulty: 'hard',
	},
];

const TaoDeThiTuLuan: React.FC = () => {
	const [form] = Form.useForm();
	const [createMode, setCreateMode] = useState<'template' | 'custom'>('template');
	const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
	const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>();
	const [configs, setConfigs] = useState<TestPaperQuestionConfig[]>([]);
	const [generatedPaper, setGeneratedPaper] = useState<any>(null);
	const [isResultVisible, setIsResultVisible] = useState(false);
	const [generationError, setGenerationError] = useState<string | null>(null);
	const [paperSaved, setPaperSaved] = useState(false);
	const { savePaper } = useTestPapers();

	const getAvailableTemplates = () => {
		return selectedSubject ? mockTemplates.filter((t) => t.subjectId === selectedSubject) : [];
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

	const handleGeneratePaper = async () => {
		try {
			// Validate
			if (!selectedSubject) {
				message.error('Vui lòng chọn môn học');
				return;
			}

			let configToUse: TestPaperQuestionConfig[] = [];

			if (createMode === 'template') {
				if (!selectedTemplate) {
					message.error('Vui lòng chọn cấu trúc đề thi');
					return;
				}
				const template = mockTemplates.find((t) => t.id === selectedTemplate);
				if (template) {
					configToUse = template.questionConfigs as TestPaperQuestionConfig[];
				}
			} else {
				if (configs.length === 0) {
					message.error('Vui lòng thêm ít nhất một cấu hình câu hỏi');
					return;
				}
				configToUse = configs;
			}

			// Check if enough questions available
			let selectedQuestions: any[] = [];
			let allChecked = true;

			for (const config of configToUse) {
				const availableQuestions = mockQuestions.filter(
					(q) =>
						q.subjectId === selectedSubject &&
						q.knowledgeBlockId === config.knowledgeBlockId &&
						q.difficulty === config.difficulty,
				);

				if (availableQuestions.length < config.quantity) {
					allChecked = false;
					break;
				}

				// Randomly select questions
				const selected = availableQuestions.sort(() => Math.random() - 0.5).slice(0, config.quantity);
				selectedQuestions = [...selectedQuestions, ...selected];
			}

			if (!allChecked) {
				setGenerationError(
					'Không đủ câu hỏi phù hợp trong ngân hàng. Vui lòng thêm câu hỏi hoặc thay đổi cấu trúc đề thi.',
				);
				setIsResultVisible(true);
				return;
			}

			// Success
			const paper = {
				id: Date.now().toString(),
				name: `Đề thi - ${mockSubjects.find((s) => s.id === selectedSubject)?.name}`,
				subject: mockSubjects.find((s) => s.id === selectedSubject),
				questions: selectedQuestions,
				structure: configToUse,
				totalQuestions: selectedQuestions.length,
				createdAt: new Date().toISOString(),
			};

			setGeneratedPaper(paper);
			setGenerationError(null);
			setIsResultVisible(true);
		} catch (error) {
			message.error('Có lỗi xảy ra khi tạo đề thi');
		}
	};

	const handleSavePaper = () => {
		if (generatedPaper) {
			const testPaperData: TestPaper = {
				id: generatedPaper.id,
				templateId: createMode === 'template' ? selectedTemplate : undefined,
				subjectId: selectedSubject || '',
				name: generatedPaper.name,
				questions: generatedPaper.questions,
				structure: generatedPaper.structure,
				createdAt: generatedPaper.createdAt,
				updatedAt: new Date().toISOString(),
			};
			savePaper(testPaperData);
			setPaperSaved(true);
			message.success(`Đề thi "${generatedPaper.name}" đã được lưu thành công`);
		}
	};

	const handleNewPaper = () => {
		setIsResultVisible(false);
		setGeneratedPaper(null);
		setGenerationError(null);
		setSelectedTemplate(undefined);
		setConfigs([]);
		setPaperSaved(false);
		form.resetFields();
	};

	const questionColumns = [
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
		},
		{
			title: 'Độ khó',
			dataIndex: 'difficulty',
			key: 'difficulty',
			width: 100,
						render: (difficulty: string) => DIFFICULTY_LABELS[difficulty as DifficultyLevel]?? difficulty,
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'knowledgeBlockId',
			key: 'knowledgeBlockId',
			width: 120,
			render: (blockId: string) => {
				const block = mockKnowledgeBlocks.find((b) => b.id === blockId);
				return block?.name;
			},
		},
	];

	return (
		<Card>
			<h2>Tạo đề thi từ ngân hàng câu hỏi</h2>

			{!isResultVisible ? (
				<>
					<Form form={form} layout='vertical'>
						<Form.Item
							name='subject'
							label='Chọn môn học'
							rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
						>
							<Select
								placeholder='Chọn môn học'
								onChange={(value) => {
									setSelectedSubject(value);
									setSelectedTemplate(undefined);
								}}
							>
								{mockSubjects.map((s) => (
									<Select.Option key={s.id} value={s.id}>
										{s.code} - {s.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Form>

					<Divider />

					{/* Mode Selection */}
					<Card style={{ marginBottom: 20, backgroundColor: '#f5f5f5' }}>
						<h4>Chọn cách tạo đề thi</h4>
						<Radio.Group value={createMode} onChange={(e) => setCreateMode(e.target.value)}>
							<Radio.Button value='template'>Sử dụng cấu trúc có sẵn</Radio.Button>
							<Radio.Button value='custom'>Tạo cấu trúc tùy chỉnh</Radio.Button>
						</Radio.Group>
					</Card>

					{/* Template Mode */}
					{createMode === 'template' && (
						<Card style={{ marginBottom: 20 }}>
							<h4>Cấu trúc đề thi có sẵn</h4>
							{getAvailableTemplates().length > 0 ? (
								<Form.Item label='Chọn cấu trúc' required>
									<Select placeholder='Chọn cấu trúc đề thi' value={selectedTemplate} onChange={setSelectedTemplate}>
										{getAvailableTemplates().map((t) => (
											<Select.Option key={t.id} value={t.id}>
												{t.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							) : (
								<Result
									status='info'
									title='Không có cấu trúc đề thi'
									subTitle='Vui lòng chọn một môn học khác hoặc tạo cấu trúc mới'
								/>
							)}
						</Card>
					)}

					{/* Custom Mode */}
					{createMode === 'custom' && (
						<Card style={{ marginBottom: 20 }}>
							<h4>Cấu hình câu hỏi tùy chỉnh (Tổng: {configs.reduce((sum, c) => sum + c.quantity, 0)} câu)</h4>
							<div style={{ marginBottom: 16 }}>
								<Button icon={<PlusOutlined />} onClick={handleAddConfig} block>
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
					)}

					{/* Generate Button */}
					<Row justify='center' gutter={16}>
						<Col>
							<Button type='primary' size='large' icon={<FileTextOutlined />} onClick={handleGeneratePaper}>
								Tạo đề thi
							</Button>
						</Col>
					</Row>
				</>
			) : (
				<>
					{/* Result Display */}
					{generationError ? (
						<Result
							status='error'
							title='Không thể tạo đề thi'
							subTitle={generationError}
							extra={
								<Button type='primary' onClick={handleNewPaper}>
									Quay lại
								</Button>
							}
						/>
					) : generatedPaper ? (
						<>
							<Result status='success' title={`Tạo đề thi thành công`} subTitle={generatedPaper.name} />

							<Card style={{ marginBottom: 20 }}>
								<h3>Thông tin đề thi</h3>
								<Row gutter={[16, 16]}>
									<Col xs={24} sm={12}>
										<p>
											<strong>Môn học:</strong> {generatedPaper.subject.code} - {generatedPaper.subject.name}
										</p>
									</Col>
									<Col xs={24} sm={12}>
										<p>
											<strong>Tổng câu hỏi:</strong> <Tag color='blue'>{generatedPaper.totalQuestions}</Tag>
										</p>
									</Col>
								</Row>

								<h4>Cấu trúc đề thi:</h4>
								<Table
									dataSource={generatedPaper.structure}
									size='small'
									pagination={false}
									columns={[
										{
											title: 'Khối kiến thức',
											dataIndex: 'knowledgeBlockId',
											render: (id: string) => mockKnowledgeBlocks.find((b) => b.id === id)?.name,
										},
										{
											title: 'Độ khó',
											dataIndex: 'difficulty',
											render: (diff: string) => DIFFICULTY_LABELS[diff as DifficultyLevel] ?? diff,
										},
										{
											title: 'Số lượng',
											dataIndex: 'quantity',
										},
									]}
									rowKey={(_, index) => `structure-${index}`}
								/>
							</Card>

							<Card style={{ marginBottom: 20 }}>
								<h3>Danh sách câu hỏi ({generatedPaper.questions.length})</h3>
								<Table
									dataSource={generatedPaper.questions}
									columns={questionColumns}
									rowKey='id'
									pagination={{ pageSize: 5 }}
								/>
							</Card>

							<Row justify='center' gutter={16}>
								<Col>
									{!paperSaved ? (
										<Button type='primary' size='large' onClick={handleSavePaper}>
											Lưu đề thi
										</Button>
									) : (
										<Button type='primary' size='large' icon={<CheckOutlined />} disabled>
											Đã lưu thành công
										</Button>
									)}
								</Col>
								{paperSaved && (
									<Col>
										<Button size='large' onClick={() => history.push('/quan-ly-de-thi/quan-ly-de-thi-da-tao')}>
											Xem đề thi đã lưu
										</Button>
									</Col>
								)}
								<Col>
									<Button size='large' onClick={handleNewPaper}>
										{paperSaved ? 'Tạo đề thi mới' : 'Hủy'}
									</Button>
								</Col>
							</Row>
						</>
					) : null}
				</>
			)}
		</Card>
	);
};

export default TaoDeThiTuLuan;
