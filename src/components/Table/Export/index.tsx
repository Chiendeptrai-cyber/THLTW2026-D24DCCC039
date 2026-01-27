import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { type TExportField } from '../typing';
import CardChooseFields from './CardChooseFields';
import CardExportFields from './CardExportFields';
import { type ModalExportProps } from './typing';

const ModalExport = (props: ModalExportProps) => {
	const { visible, onCancel, modelName, maskCloseableForm, fileName, condition, filters, otherQuery } = props;
	const { getExportFieldsModel, postExportModel, formSubmiting, selectedIds } = useModel(modelName);
	const [allFields, setAllFields] = useState<TExportField[]>([]); // Export Fields lấy từ API
	const [exportFields, setExportFields] = useState<TExportField[]>([]);
	const [isGetFields, setIsGetFields] = useState<boolean>(false);
	const finalFields = exportFields.filter((item) => item.selected);

	const genFlatData = (data?: TExportField[], disableImport?: boolean): TExportField[] => {
		if (!data?.length) return [];
		// Nếu có field con thì populate hết các field con,
		// còn ko thì trả về chính nó
		// MẶC ĐỊNH chọn những trường KHÔNG disableImport và cha của nó cũng không disableImport
		return data
			.map((item) =>
				!item.children
					? [{ ...item, selected: !disableImport && !item.disableImport }]
					: genFlatData(item.children, item.disableImport || disableImport),
			)
			.flat();
	};

	const getFields = () => {
		if (getExportFieldsModel)
			getExportFieldsModel().then((fields: TExportField[]) => {
				setAllFields(fields);

				const flatData = genFlatData(fields);
				setExportFields(flatData);
			});
	};

	useEffect(() => {
		setIsGetFields(false);
	}, [modelName]);

	useEffect(() => {
		if (visible && !isGetFields) {
			getFields();
			setIsGetFields(true);
		}
	}, [visible]);

	const onCancelModal = () => onCancel();

	const onFinish = () => {
		if (finalFields.length)
			postExportModel(
				selectedIds?.length > 0 ? { ids: selectedIds, definitions: finalFields } : { definitions: finalFields },
				condition,
				filters,
				otherQuery,
			).then((blob: Blob) => {
				fileDownload(blob, fileName);
				onCancel();
			});
	};

	return (
		<Modal
			title='Xuất dữ liệu'
			visible={visible}
			onCancel={onCancelModal}
			footer={null}
			width={800}
			destroyOnClose
			maskClosable={maskCloseableForm || false}
		>
			{!!exportFields.length ? (
				<>
					<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
						{selectedIds?.length > 0 ? <Col span={24}>Trích xuất {selectedIds?.length} mục đã chọn</Col> : null}

						<Col
							span={24}
							style={{
								marginBottom: '-15px',
							}}
						>
							Chọn các trường dữ liệu cần trích xuất:
						</Col>

						<Col span={24} md={12}>
							<CardChooseFields allFields={allFields} fields={exportFields} setFields={setExportFields} />
						</Col>
						<Col span={24} md={12}>
							<CardExportFields fields={exportFields} setFields={setExportFields} />
						</Col>
					</Row>

					<div className='form-footer'>
						<Button
							type='primary'
							icon={<FileExcelOutlined />}
							onClick={onFinish}
							disabled={!finalFields.length}
							loading={formSubmiting}
						>
							Tải xuống dữ liệu
						</Button>
						<Button onClick={onCancelModal}>Hủy</Button>
					</div>
				</>
			) : (
				<Empty description='Chức năng chưa được hỗ trợ' />
			)}
		</Modal>
	);
};

export default ModalExport;
