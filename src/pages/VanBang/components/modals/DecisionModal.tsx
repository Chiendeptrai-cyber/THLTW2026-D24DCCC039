import { DatePicker, Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import React from 'react';
import type { DiplomaBook, GraduationDecision } from '../../types';

interface DecisionModalProps {
	visible: boolean;
	editingDecision?: GraduationDecision;
	onCancel: () => void;
	onOk: () => Promise<void>;
	decisionForm: FormInstance;
	books: DiplomaBook[];
}

const DecisionModal: React.FC<DecisionModalProps> = ({
	visible,
	editingDecision,
	onCancel,
	onOk,
	decisionForm,
	books,
}) => (
	<Modal
		title={editingDecision ? 'Chỉnh sửa quyết định' : 'Thêm quyết định'}
		visible={visible}
		onCancel={onCancel}
		onOk={onOk}
		destroyOnClose
	>
		<Form form={decisionForm} layout='vertical'>
			<Form.Item
				name='decisionNumber'
				label='Số quyết định'
				rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name='issueDate'
				label='Ngày ban hành'
				rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
			>
				<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				name='summary'
				label='Trích yếu'
				rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
			>
				<Input.TextArea rows={3} />
			</Form.Item>
			<Form.Item
				name='bookId'
				label='Thuộc sổ văn bằng'
				rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
			>
				<Select
					options={books.map((book) => ({
						label: `Sổ năm ${book.year}`,
						value: book.id,
					}))}
				/>
			</Form.Item>
		</Form>
	</Modal>
);

export default DecisionModal;
