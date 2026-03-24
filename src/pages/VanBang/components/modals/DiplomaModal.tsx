import { DatePicker, Divider, Form, Input, InputNumber, Modal, Row, Col, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import React from 'react';
import type { DiplomaInfo, TemplateField } from '../../types';

interface DecisionOption {
	label: string;
	value: string;
}

interface DiplomaModalProps {
	visible: boolean;
	editingDiploma?: DiplomaInfo;
	onCancel: () => void;
	onOk: () => Promise<void>;
	diplomaForm: FormInstance;
	decisionOptions: DecisionOption[];
	computedEntryNumber: number;
	onDecisionChange: (decisionId?: string) => void;
	fields: TemplateField[];
}

const DiplomaModal: React.FC<DiplomaModalProps> = ({
	visible,
	editingDiploma,
	onCancel,
	onOk,
	diplomaForm,
	decisionOptions,
	computedEntryNumber,
	onDecisionChange,
	fields,
}) => (
	<Modal
		title={editingDiploma ? 'Chỉnh sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
		visible={visible}
		onCancel={onCancel}
		onOk={onOk}
		destroyOnClose
		width={900}
	>
		<Form form={diplomaForm} layout='vertical'>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item
						name='decisionId'
						label='Quyết định tốt nghiệp'
						rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
					>
						<Select options={decisionOptions} onChange={(value) => onDecisionChange(value as string)} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label='Số vào sổ (tự động)'>
						<Input value={computedEntryNumber || ''} disabled />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name='diplomaNumber'
						label='Số hiệu văn bằng'
						rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name='studentCode'
						label='Mã sinh viên'
						rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name='fullName'
						label='Họ tên'
						rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name='birthDate'
						label='Ngày sinh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
					>
						<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
			</Row>
			{fields.length > 0 && (
				<>
					<Divider orientation='left'>Trường phụ lục cấu hình</Divider>
					<Row gutter={16}>
						{fields.map((field) => (
							<Col span={8} key={field.id}>
								<Form.Item name={['dynamicValues', field.id]} label={field.name}>
									{field.type === 'string' && <Input />}
									{field.type === 'number' && <InputNumber style={{ width: '100%' }} />}
									{field.type === 'date' && <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />}
								</Form.Item>
							</Col>
						))}
					</Row>
				</>
			)}
		</Form>
	</Modal>
);

export default DiplomaModal;
