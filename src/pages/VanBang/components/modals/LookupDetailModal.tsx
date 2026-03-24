import { Descriptions, Modal } from 'antd';
import moment from 'moment';
import React from 'react';
import type { DiplomaInfo, GraduationDecision, TemplateField } from '../../types';

interface LookupDetailModalProps {
	selectedDetail?: DiplomaInfo;
	fields: TemplateField[];
	onClose: () => void;
	getDecisionById: (decisionId: string) => GraduationDecision | undefined;
}

const LookupDetailModal: React.FC<LookupDetailModalProps> = ({ selectedDetail, fields, onClose, getDecisionById }) => (
	<Modal title='Chi tiết văn bằng tra cứu' visible={!!selectedDetail} onCancel={onClose} footer={null} width={900}>
		{selectedDetail && (
			<Descriptions bordered column={2} size='small'>
				<Descriptions.Item label='Số vào sổ'>{selectedDetail.entryNumber}</Descriptions.Item>
				<Descriptions.Item label='Số hiệu văn bằng'>{selectedDetail.diplomaNumber}</Descriptions.Item>
				<Descriptions.Item label='Mã sinh viên'>{selectedDetail.studentCode}</Descriptions.Item>
				<Descriptions.Item label='Họ tên'>{selectedDetail.fullName}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{moment(selectedDetail.birthDate).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Số quyết định'>
					{getDecisionById(selectedDetail.decisionId)?.decisionNumber || '-'}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày ban hành QĐ'>
					{getDecisionById(selectedDetail.decisionId)
						? moment(getDecisionById(selectedDetail.decisionId)?.issueDate).format('DD/MM/YYYY')
						: '-'}
				</Descriptions.Item>
				<Descriptions.Item label='Trích yếu quyết định'>
					{getDecisionById(selectedDetail.decisionId)?.summary || '-'}
				</Descriptions.Item>
				{fields.map((field) => {
					const raw = selectedDetail.dynamicValues[field.id];
					let value: string | number = '-';
					if (raw !== undefined && raw !== null && raw !== '') {
						if (field.type === 'date') {
							value = moment(raw as string).format('DD/MM/YYYY');
						} else {
							value = raw;
						}
					}
					return (
						<Descriptions.Item key={field.id} label={field.name}>
							{value}
						</Descriptions.Item>
					);
				})}
			</Descriptions>
		)}
	</Modal>
);

export default LookupDetailModal;
