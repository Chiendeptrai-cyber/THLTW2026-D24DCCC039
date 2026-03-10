import React, { useState } from 'react';
import {
	Card,
	Table,
	Button,
	Space,
	message,
	Tag,
	Row,
	Col,
	Tooltip,
	Drawer,
	Popconfirm,
} from 'antd';
import {
	EyeOutlined,
	DeleteOutlined,
	DownloadOutlined,
	CopyOutlined,
	FileTextOutlined,
} from '@ant-design/icons';
import { TestPaper, DIFFICULTY_LABELS, DifficultyLevel } from '@/types/exam';
import useTestPapers from '@/models/testpapers';

const mockSubjects: any[] = [
	{ id: '1', code: 'CS101', name: 'Lập trình cơ bản' },
	{ id: '2', code: 'CS201', name: 'Cấu trúc dữ liệu' },
];

const mockKnowledgeBlocks: any[] = [
	{ id: '1', name: 'Tổng quan' },
	{ id: '2', name: 'Chuyên sâu' },
];

const QuanLyDeThiDaTao: React.FC = () => {
	const { papers, deletePaper } = useTestPapers();
	const [selectedPaper, setSelectedPaper] = useState<TestPaper | null>(null);
	const [drawerVisible, setDrawerVisible] = useState(false);

	const handleViewPaper = (paper: TestPaper) => {
		setSelectedPaper(paper);
		setDrawerVisible(true);
	};

	const handleDeletePaper = (id: string) => {
		deletePaper(id);
		message.success('Xóa đề thi thành công');
	};

	const handleDuplicatePaper = (paper: TestPaper) => {
		// This would typically call a function to duplicate the paper
		// For now, we'll just show a message
		message.info('Tính năng nhân bản đề thi sẽ được cập nhật');
	};

	const handleDownloadPaper = (paper: TestPaper) => {
		// Generate a simple PDF or document download
		const content = `
Đề Thi: ${paper.name}
Môn Học: ${mockSubjects.find((s) => s.id === paper.subjectId)?.name || 'N/A'}
Ngày Tạo: ${new Date(paper.createdAt).toLocaleDateString('vi-VN')}
Tổng Câu Hỏi: ${paper.questions.length}

DANH SÁCH CÂU HỎI:
${paper.questions.map((q, i) => `${i + 1}. ${q.code} - ${q.content} (${DIFFICULTY_LABELS[q.difficulty]})`).join('\n')}
		`;
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		element.setAttribute('download', `${paper.name}.txt`);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		message.success('Tải đề thi thành công');
	};

	const columns = [
		{
			title: 'STT',
			width: 50,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: 'Tên đề thi',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: TestPaper) => (
				<Tooltip title='Nhấp để xem chi tiết'>
					<Button type='link' onClick={() => handleViewPaper(record)}>
						{text}
					</Button>
				</Tooltip>
			),
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
			title: 'Số câu hỏi',
			dataIndex: ['questions', 'length'],
			key: 'questionCount',
			width: 100,
			render: (count: number, record: TestPaper) => <Tag color='blue'>{record.questions.length}</Tag>,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 200,
			render: (_text: any, record: TestPaper) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EyeOutlined />}
						onClick={() => handleViewPaper(record)}
						title='Xem chi tiết'
					/>
					<Button
						size='small'
						icon={<CopyOutlined />}
						onClick={() => handleDuplicatePaper(record)}
						title='Nhân bản'
					/>
					<Button
						size='small'
						icon={<DownloadOutlined />}
						onClick={() => handleDownloadPaper(record)}
						title='Tải xuống'
					/>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa đề thi này?'
						onConfirm={() => handleDeletePaper(record.id)}
					>
						<Button danger size='small' icon={<DeleteOutlined />} title='Xóa' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Card>
				<div style={{ marginBottom: 20 }}>
					<h2>
						<FileTextOutlined /> Quản lý đề thi đã tạo
					</h2>
					<p style={{ color: '#666', marginTop: 8 }}>
						Tổng số đề thi: <Tag color='blue'>{papers.length}</Tag>
					</p>
				</div>

				{papers.length === 0 ? (
					<div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
						<p>Chưa có đề thi nào</p>
					</div>
				) : (
					<Table
						dataSource={papers}
						columns={columns}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						scroll={{ x: 1200 }}
					/>
				)}
			</Card>

			{/* Detail Drawer */}
			<Drawer
				title={`Chi tiết đề thi: ${selectedPaper?.name}`}
				placement='right'
				onClose={() => setDrawerVisible(false)}
				visible={drawerVisible}
				width={800}
			>
				{selectedPaper && (
					<>
						<Card style={{ marginBottom: 20 }}>
							<h3>Thông tin chung</h3>
							<Row gutter={[16, 16]}>
								<Col xs={24} sm={12}>
									<p>
										<strong>Tên đề thi:</strong> {selectedPaper.name}
									</p>
								</Col>
								<Col xs={24} sm={12}>
									<p>
										<strong>Môn học:</strong>{' '}
										{mockSubjects.find((s) => s.id === selectedPaper.subjectId)?.name || 'N/A'}
									</p>
								</Col>
								<Col xs={24} sm={12}>
									<p>
										<strong>Ngày tạo:</strong> {new Date(selectedPaper.createdAt).toLocaleDateString('vi-VN')}
									</p>
								</Col>
								<Col xs={24} sm={12}>
									<p>
										<strong>Tổng câu hỏi:</strong> <Tag color='blue'>{selectedPaper.questions.length}</Tag>
									</p>
								</Col>
							</Row>
						</Card>

						<Card style={{ marginBottom: 20 }}>
							<h3>Cấu trúc đề thi</h3>
							<Table
								dataSource={selectedPaper.structure}
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

						<Card>
							<h3>Danh sách câu hỏi</h3>
							<Table
								dataSource={selectedPaper.questions}
								size='small'
								pagination={{ pageSize: 5 }}
								columns={[
									{
										title: 'Mã',
										dataIndex: 'code',
										width: 80,
									},
									{
										title: 'Nội dung',
										dataIndex: 'content',
									},
									{
										title: 'Độ khó',
										dataIndex: 'difficulty',
										width: 80,
										render: (diff: string) => DIFFICULTY_LABELS[diff as DifficultyLevel] ?? diff,
									},
									{
										title: 'Khối kiến thức',
										dataIndex: 'knowledgeBlockId',
										width: 100,
										render: (blockId: string) =>
											mockKnowledgeBlocks.find((b) => b.id === blockId)?.name,
									},
								]}
								rowKey='id'
							/>
						</Card>

						<Row justify='center' gutter={16} style={{ marginTop: 20 }}>
							<Col>
								<Button type='primary' onClick={() => handleDownloadPaper(selectedPaper)}>
									Tải xuống
								</Button>
							</Col>
							<Col>
								<Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
							</Col>
						</Row>
					</>
				)}
			</Drawer>
		</>
	);
};

export default QuanLyDeThiDaTao;
