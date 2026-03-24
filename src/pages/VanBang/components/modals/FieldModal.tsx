import { Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import React from 'react';
import type { TemplateField } from '../../types';

interface FieldModalProps {
	visible: boolean;
	editingField?: TemplateField;
	onCancel: () => void;
	onOk: () => Promise<void>;
	fieldForm: FormInstance;
}

const FieldModal: React.FC<FieldModalProps> = ({ visible, editingField, onCancel, onOk, fieldForm }) => (
	<Modal
		title={editingField ? 'Chỉnh sửa trường phụ lục' : 'Thêm trường phụ lục'}
		visible={visible}
		onCancel={onCancel}
		onOk={onOk}
		destroyOnClose
	>
		<Form form={fieldForm} layout='vertical'>
			<Form.Item
				name='name'
				label='Tên trường'
				rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
			>
				<Input placeholder='Ví dụ: Dân tộc, Nơi sinh, Điểm trung bình' />
			</Form.Item>
			<Form.Item
				name='type'
				label='Kiểu dữ liệu'
				rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
			>
				<Select
					options={[
						{ label: 'String', value: 'string' },
						{ label: 'Number', value: 'number' },
						{ label: 'Date', value: 'date' },
					]}
				/>
			</Form.Item>
		</Form>
	</Modal>
);

export default FieldModal;
