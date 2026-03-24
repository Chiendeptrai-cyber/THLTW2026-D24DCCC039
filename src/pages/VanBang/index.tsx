import { Form, Tabs, Typography, message } from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import DecisionModal from './components/modals/DecisionModal';
import DiplomaModal from './components/modals/DiplomaModal';
import FieldModal from './components/modals/FieldModal';
import LookupDetailModal from './components/modals/LookupDetailModal';
import BookTab from './components/tabs/BookTab';
import DecisionTab from './components/tabs/DecisionTab';
import DiplomaTab from './components/tabs/DiplomaTab';
import FieldTab from './components/tabs/FieldTab';
import LookupTab from './components/tabs/LookupTab';
import type {
	DecisionFormValues,
	DiplomaFormValues,
	DiplomaInfo,
	FieldFormValues,
	GraduationDecision,
	RegistryStore,
	SearchFormValue,
	TemplateField,
} from './types';
import { createId, loadStore, normalizeString, saveStore } from './utils';

const { TabPane } = Tabs;
const { Title } = Typography;

const VanBangPage: React.FC = () => {
	const [store, setStore] = useState<RegistryStore>(() => loadStore());

	const [bookForm] = Form.useForm<{ year: number }>();
	const [decisionForm] = Form.useForm<DecisionFormValues>();
	const [fieldForm] = Form.useForm<FieldFormValues>();
	const [diplomaForm] = Form.useForm<DiplomaFormValues>();
	const [searchForm] = Form.useForm<SearchFormValue>();

	const [decisionModalVisible, setDecisionModalVisible] = useState(false);
	const [editingDecision, setEditingDecision] = useState<GraduationDecision>();

	const [fieldModalVisible, setFieldModalVisible] = useState(false);
	const [editingField, setEditingField] = useState<TemplateField>();

	const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);
	const [editingDiploma, setEditingDiploma] = useState<DiplomaInfo>();
	const [computedEntryNumber, setComputedEntryNumber] = useState<number>(0);

	const [searchResult, setSearchResult] = useState<DiplomaInfo[]>([]);
	const [selectedDetail, setSelectedDetail] = useState<DiplomaInfo>();

	const setAndPersistStore = (updater: (current: RegistryStore) => RegistryStore) => {
		setStore((current) => {
			const next = updater(current);
			saveStore(next);
			return next;
		});
	};

	const decisionOptions = useMemo(
		() =>
			store.decisions.map((decision) => ({
				label: `${decision.decisionNumber} - ${moment(decision.issueDate).format('DD/MM/YYYY')}`,
				value: decision.id,
			})),
		[store.decisions],
	);

	const getBookById = (bookId: string) => store.books.find((book) => book.id === bookId);
	const getDecisionById = (decisionId: string) => store.decisions.find((decision) => decision.id === decisionId);

	const getNextEntryNumber = (bookId: string, ignoredDiplomaId?: string) => {
		const currentMax = store.diplomas
			.filter((diploma) => diploma.bookId === bookId && diploma.id !== ignoredDiplomaId)
			.reduce((max, current) => Math.max(max, current.entryNumber), 0);
		return currentMax + 1;
	};

	const handleCreateBook = async () => {
		const values = await bookForm.validateFields();
		const existed = store.books.some((book) => book.year === values.year);
		if (existed) {
			message.error('Mỗi năm chỉ được tạo 1 sổ văn bằng');
			return;
		}
		setAndPersistStore((current) => ({
			...current,
			books: [
				...current.books,
				{
					id: createId(),
					year: values.year,
					createdAt: new Date().toISOString(),
				},
			],
		}));
		bookForm.resetFields();
		message.success('Đã mở sổ văn bằng mới');
	};

	const openCreateDecisionModal = () => {
		setEditingDecision(undefined);
		decisionForm.resetFields();
		setDecisionModalVisible(true);
	};

	const openEditDecisionModal = (record: GraduationDecision) => {
		setEditingDecision(record);
		decisionForm.setFieldsValue({
			decisionNumber: record.decisionNumber,
			issueDate: moment(record.issueDate),
			summary: record.summary,
			bookId: record.bookId,
		});
		setDecisionModalVisible(true);
	};

	const handleSubmitDecision = async () => {
		const values = await decisionForm.validateFields();
		setAndPersistStore((current) => {
			if (editingDecision) {
				return {
					...current,
					decisions: current.decisions.map((decision) =>
						decision.id === editingDecision.id
							? {
									...decision,
									decisionNumber: values.decisionNumber,
									issueDate: values.issueDate.format('YYYY-MM-DD'),
									summary: values.summary,
									bookId: values.bookId,
							  }
							: decision,
					),
				};
			}
			return {
				...current,
				decisions: [
					...current.decisions,
					{
						id: createId(),
						decisionNumber: values.decisionNumber,
						issueDate: values.issueDate.format('YYYY-MM-DD'),
						summary: values.summary,
						bookId: values.bookId,
						lookupCount: 0,
					},
				],
			};
		});
		setDecisionModalVisible(false);
		setEditingDecision(undefined);
		message.success(editingDecision ? 'Đã cập nhật quyết định' : 'Đã tạo quyết định');
	};

	const handleDeleteDecision = (decision: GraduationDecision) => {
		const hasUsed = store.diplomas.some((diploma) => diploma.decisionId === decision.id);
		if (hasUsed) {
			message.error('Không thể xóa quyết định đã có thông tin văn bằng');
			return;
		}
		setAndPersistStore((current) => ({
			...current,
			decisions: current.decisions.filter((item) => item.id !== decision.id),
		}));
		message.success('Đã xóa quyết định');
	};

	const openCreateFieldModal = () => {
		setEditingField(undefined);
		fieldForm.resetFields();
		setFieldModalVisible(true);
	};

	const openEditFieldModal = (record: TemplateField) => {
		setEditingField(record);
		fieldForm.setFieldsValue(record);
		setFieldModalVisible(true);
	};

	const handleSubmitField = async () => {
		const values = await fieldForm.validateFields();
		const duplicated = store.fields.some(
			(field) => normalizeString(field.name) === normalizeString(values.name) && field.id !== editingField?.id,
		);
		if (duplicated) {
			message.error('Tên trường đã tồn tại');
			return;
		}
		setAndPersistStore((current) => {
			if (editingField) {
				return {
					...current,
					fields: current.fields.map((field) =>
						field.id === editingField.id
							? {
									...field,
									name: values.name,
									type: values.type,
							  }
							: field,
					),
				};
			}
			return {
				...current,
				fields: [
					...current.fields,
					{
						id: createId(),
						name: values.name,
						type: values.type,
					},
				],
			};
		});
		setFieldModalVisible(false);
		setEditingField(undefined);
		message.success(editingField ? 'Đã cập nhật trường biểu mẫu' : 'Đã thêm trường biểu mẫu');
	};

	const handleDeleteField = (field: TemplateField) => {
		setAndPersistStore((current) => ({
			...current,
			fields: current.fields.filter((item) => item.id !== field.id),
			diplomas: current.diplomas.map((diploma) => {
				const nextValues = { ...diploma.dynamicValues };
				delete nextValues[field.id];
				return {
					...diploma,
					dynamicValues: nextValues,
				};
			}),
		}));
		message.success('Đã xóa trường biểu mẫu');
	};

	const openCreateDiplomaModal = () => {
		setEditingDiploma(undefined);
		diplomaForm.resetFields();
		setComputedEntryNumber(0);
		setDiplomaModalVisible(true);
	};

	const openEditDiplomaModal = (record: DiplomaInfo) => {
		setEditingDiploma(record);
		const dynamicInit: Record<string, any> = {};
		store.fields.forEach((field) => {
			const raw = record.dynamicValues[field.id];
			if (field.type === 'date') {
				dynamicInit[field.id] = raw ? moment(raw as string) : undefined;
			} else {
				dynamicInit[field.id] = raw;
			}
		});
		diplomaForm.setFieldsValue({
			decisionId: record.decisionId,
			diplomaNumber: record.diplomaNumber,
			studentCode: record.studentCode,
			fullName: record.fullName,
			birthDate: moment(record.birthDate),
			dynamicValues: dynamicInit,
		});
		setComputedEntryNumber(record.entryNumber);
		setDiplomaModalVisible(true);
	};

	const onDecisionChangeInDiplomaForm = (decisionId?: string) => {
		if (!decisionId) {
			setComputedEntryNumber(0);
			return;
		}
		const decision = getDecisionById(decisionId);
		if (!decision) {
			setComputedEntryNumber(0);
			return;
		}
		const next = getNextEntryNumber(decision.bookId, editingDiploma?.id);
		setComputedEntryNumber(next);
	};

	const handleSubmitDiploma = async () => {
		const values = await diplomaForm.validateFields();
		const decision = getDecisionById(values.decisionId);
		if (!decision) {
			message.error('Không tìm thấy quyết định tốt nghiệp');
			return;
		}

		const dynamicValues: Record<string, string | number> = {};
		store.fields.forEach((field) => {
			const rawValue = values.dynamicValues?.[field.id];
			if (rawValue === undefined || rawValue === null || rawValue === '') {
				return;
			}
			if (field.type === 'date' && moment.isMoment(rawValue)) {
				dynamicValues[field.id] = rawValue.format('YYYY-MM-DD');
			} else {
				dynamicValues[field.id] = rawValue;
			}
		});

		setAndPersistStore((current) => {
			if (editingDiploma) {
				const updatedEntryNumber = getNextEntryNumber(decision.bookId, editingDiploma.id);
				return {
					...current,
					diplomas: current.diplomas.map((item) =>
						item.id === editingDiploma.id
							? {
									...item,
									decisionId: values.decisionId,
									bookId: decision.bookId,
									entryNumber: updatedEntryNumber,
									diplomaNumber: values.diplomaNumber,
									studentCode: values.studentCode,
									fullName: values.fullName,
									birthDate: values.birthDate.format('YYYY-MM-DD'),
									dynamicValues,
							  }
							: item,
					),
				};
			}
			const nextEntryNumber = getNextEntryNumber(decision.bookId);
			return {
				...current,
				diplomas: [
					...current.diplomas,
					{
						id: createId(),
						decisionId: values.decisionId,
						bookId: decision.bookId,
						entryNumber: nextEntryNumber,
						diplomaNumber: values.diplomaNumber,
						studentCode: values.studentCode,
						fullName: values.fullName,
						birthDate: values.birthDate.format('YYYY-MM-DD'),
						dynamicValues,
					},
				],
			};
		});

		setDiplomaModalVisible(false);
		setEditingDiploma(undefined);
		diplomaForm.resetFields();
		message.success(editingDiploma ? 'Đã cập nhật thông tin văn bằng' : 'Đã thêm thông tin văn bằng');
	};

	const handleDeleteDiploma = (record: DiplomaInfo) => {
		setAndPersistStore((current) => ({
			...current,
			diplomas: current.diplomas.filter((item) => item.id !== record.id),
		}));
		message.success('Đã xóa thông tin văn bằng');
	};

	const handleLookup = async () => {
		const values = (await searchForm.validateFields()) as SearchFormValue;
		const criteriaCount = [
			values.diplomaNumber,
			values.entryNumber,
			values.studentCode,
			values.fullName,
			values.birthDate,
		].filter((item) => item !== undefined && item !== null && item !== '').length;

		if (criteriaCount < 2) {
			message.error('Vui lòng nhập tối thiểu 2 tham số tra cứu');
			return;
		}

		const result = store.diplomas.filter((diploma) => {
			if (
				values.diplomaNumber &&
				!normalizeString(diploma.diplomaNumber).includes(normalizeString(values.diplomaNumber))
			) {
				return false;
			}
			if (values.entryNumber && diploma.entryNumber !== values.entryNumber) {
				return false;
			}
			if (
				values.studentCode &&
				!normalizeString(diploma.studentCode).includes(normalizeString(values.studentCode))
			) {
				return false;
			}
			if (values.fullName && !normalizeString(diploma.fullName).includes(normalizeString(values.fullName))) {
				return false;
			}
			if (values.birthDate && diploma.birthDate !== values.birthDate.format('YYYY-MM-DD')) {
				return false;
			}
			return true;
		});

		setSearchResult(result);
		message.info(`Tìm thấy ${result.length} văn bằng`);
	};

	const handleViewLookupDetail = (record: DiplomaInfo) => {
		setSelectedDetail(record);
		setAndPersistStore((current) => ({
			...current,
			decisions: current.decisions.map((decision) =>
				decision.id === record.decisionId ? { ...decision, lookupCount: decision.lookupCount + 1 } : decision,
			),
		}));
	};

	return (
		<div>
			<Title level={3}>Quản lý sổ văn bằng tốt nghiệp</Title>
			<Tabs defaultActiveKey='books'>
				<TabPane tab='Sổ văn bằng' key='books'>
					<BookTab
						books={store.books}
						diplomas={store.diplomas}
						bookForm={bookForm}
						onCreateBook={handleCreateBook}
						getNextEntryNumber={getNextEntryNumber}
					/>
				</TabPane>
				<TabPane tab='Quyết định tốt nghiệp' key='decisions'>
					<DecisionTab
						decisions={store.decisions}
						books={store.books}
						onOpenCreate={openCreateDecisionModal}
						onEdit={openEditDecisionModal}
						onDelete={handleDeleteDecision}
						getBookById={getBookById}
					/>
				</TabPane>
				<TabPane tab='Cấu hình phụ lục văn bằng' key='fields'>
					<FieldTab
						fields={store.fields}
						onOpenCreate={openCreateFieldModal}
						onEdit={openEditFieldModal}
						onDelete={handleDeleteField}
					/>
				</TabPane>
				<TabPane tab='Thông tin văn bằng' key='diplomas'>
					<DiplomaTab
						diplomas={store.diplomas}
						decisions={store.decisions}
						onOpenCreate={openCreateDiplomaModal}
						onEdit={openEditDiplomaModal}
						onDelete={handleDeleteDiploma}
						getDecisionById={getDecisionById}
					/>
				</TabPane>
				<TabPane tab='Tra cứu văn bằng' key='lookup'>
					<LookupTab
						searchForm={searchForm}
						searchResult={searchResult}
						onLookup={handleLookup}
						onReset={() => {
							searchForm.resetFields();
							setSearchResult([]);
						}}
						onViewDetail={handleViewLookupDetail}
					/>
				</TabPane>
			</Tabs>

			<DecisionModal
				visible={decisionModalVisible}
				editingDecision={editingDecision}
				onCancel={() => {
					setDecisionModalVisible(false);
					setEditingDecision(undefined);
				}}
				onOk={handleSubmitDecision}
				decisionForm={decisionForm}
				books={store.books}
			/>

			<FieldModal
				visible={fieldModalVisible}
				editingField={editingField}
				onCancel={() => {
					setFieldModalVisible(false);
					setEditingField(undefined);
				}}
				onOk={handleSubmitField}
				fieldForm={fieldForm}
			/>

			<DiplomaModal
				visible={diplomaModalVisible}
				editingDiploma={editingDiploma}
				onCancel={() => {
					setDiplomaModalVisible(false);
					setEditingDiploma(undefined);
				}}
				onOk={handleSubmitDiploma}
				diplomaForm={diplomaForm}
				decisionOptions={decisionOptions}
				computedEntryNumber={computedEntryNumber}
				onDecisionChange={onDecisionChangeInDiplomaForm}
				fields={store.fields}
			/>

			<LookupDetailModal
				selectedDetail={selectedDetail}
				onClose={() => setSelectedDetail(undefined)}
				fields={store.fields}
				getDecisionById={getDecisionById}
			/>
		</div>
	);
};

export default VanBangPage;
