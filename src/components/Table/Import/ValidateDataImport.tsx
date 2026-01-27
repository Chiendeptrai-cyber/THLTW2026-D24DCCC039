import { ArrowLeftOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Popconfirm, Row, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import { type IColumn, type TImportResponse, type TImportRowResponse } from '../typing';

const ValidateDataImport = (props: { onOk: () => void; onCancel: () => void; onBack: any; modelName: any }) => {
	const { onOk, onCancel, onBack, modelName } = props;
	const { dataImport, startLine } = useModel('import');
	const { postValidateModel, postExecuteImpotModel, formSubmiting } = useModel(modelName);
	const [importResponses, setImportResponses] = useState<TImportRowResponse[]>([]);
	const [errorCount, setErrorCount] = useState<number>();
	const [isError, setIsError] = useState<boolean>();
	const [step, setStep] = useState(0);

	const columns: IColumn<TImportRowResponse>[] = [
		{
			title: 'Thứ tự hàng',
			dataIndex: 'rowIndex',
			width: 80,
			align: 'center',
		},
		{
			title: 'Trạng thái',
			width: 120,
			align: 'center',
			render: (val, rec) =>
				!!rec.rowErrors?.length ? (
					<Tag color='red'>{step === 0 ? 'Không hợp lệ' : 'Không thành công'}</Tag>
				) : (
					<Tag color='green'>{step === 0 ? 'Hợp lệ' : 'Thành công'}</Tag>
				),
		},
	];

	const validateData = async () => {
		if (postValidateModel)
			postValidateModel(dataImport)
				.then((res: TImportResponse) => {
					setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
					setIsError(res.error);
					const temp = res.validate?.map((item) => ({ ...item, rowIndex: item.index + startLine }));
					setImportResponses(temp ?? []);
				})
				.catch((err: any) => console.log(err));
	};

	useEffect(() => {
		validateData();
	}, []);

	const onExecute = () => {
		postExecuteImpotModel(dataImport)
			.then((res: TImportResponse) => {
				setStep(1);
				setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
				setIsError(res.error);
				const temp = res.validate?.map((item) => ({ ...item, rowIndex: item.index + startLine }));
				setImportResponses(temp ?? []);

				onOk(); // Get data
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<div className='fw500'>Kết quả kiểm tra</div>
				<i>Dữ liệu đã được kiểm tra trên hệ thống. Vui lòng xem danh sách chi tiết dưới đây.</i>
			</Col>

			{!formSubmiting ? (
				errorCount ? (
					<Col span={24}>
						{step === 0 ? (
							<>
								<span className='fw500'>Hiện tại có </span>
								<Tag color='red'>{errorCount} dòng không hợp lệ</Tag>
								<br />
								Bạn hãy kiểm tra lại dữ liệu hoặc loại bỏ những dòng không hợp lệ để có thể Lưu dữ liệu vào hệ thống.
								{/* Bạn có thể kiểm tra lại trước khi Lưu dữ liệu vào hệ thống! */}
							</>
						) : (
							<>
								<span className='fw500'>Thực hiện lưu </span>
								<Tag color='red'>{errorCount} dòng không thành công</Tag>
							</>
						)}
					</Col>
				) : !isError ? (
					<Col span={24}>
						<Space
							style={{ marginTop: 12, marginBottom: 12, justifyContent: 'center', width: '100%' }}
							align='center'
							className='text-success'
						>
							<CheckCircleOutlined style={{ fontSize: 24 }} />
							<span className='fw500' style={{ fontSize: 18 }}>
								Tất cả dữ liệu {importResponses.length} hàng đã được {step === 0 ? 'kiểm tra hợp lệ' : 'lưu thành công'}
							</span>
						</Space>
					</Col>
				) : (
					<Col span={24}>
						<div className='text-error'>Có lỗi xảy ra!</div>
					</Col>
				)
			) : (
				<div style={{ width: '100%', textAlign: 'center', marginTop: 12, marginBottom: 12 }}>
					<Spin spinning />
				</div>
			)}

			{importResponses.length ? (
				<Col span={24}>
					<Collapse defaultActiveKey={errorCount ? 1 : undefined}>
						<Collapse.Panel key={0} header={`Thành công (${importResponses.length - (errorCount ?? 0)})`}>
							<TableStaticData
								columns={columns}
								data={importResponses.filter((item) => !item?.rowErrors?.length)}
								loading={formSubmiting}
								size='small'
								hasTotal
							/>
						</Collapse.Panel>
						<Collapse.Panel key={1} header={`Thất bại (${errorCount ?? 0})`}>
							<TableStaticData
								columns={[
									...columns,
									{
										dataIndex: 'rowErrors',
										title: 'Thông tin lỗi',
										width: 350,
										render: (val) => val?.join(', '),
									},
								]}
								data={importResponses.filter((item) => item.rowErrors?.length)}
								loading={formSubmiting}
								size='small'
								hasTotal
							/>
						</Collapse.Panel>
					</Collapse>
				</Col>
			) : null}

			<Col span={24}>
				<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
					<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
						Quay lại
					</Button>

					{step === 0 ? (
						<Popconfirm
							title={
								errorCount ? (
									<>
										Tồn tại dữ liệu không hợp lệ
										<br />
										Vẫn xác nhận Lưu dữ liệu?
									</>
								) : (
									'Xác nhận lưu dữ liệu vào hệ thống?'
								)
							}
							onConfirm={onExecute}
							// disabled={isError || !!errorCount}
						>
							<Button
								htmlType='submit'
								type='primary'
								loading={formSubmiting}
								icon={<SaveOutlined />}
								// disabled={isError || !!errorCount}
							>
								Lưu dữ liệu
							</Button>
						</Popconfirm>
					) : (
						<Button onClick={onCancel}>Hoàn thành</Button>
					)}
				</Space>
			</Col>
		</Row>
	);
};

export default ValidateDataImport;
