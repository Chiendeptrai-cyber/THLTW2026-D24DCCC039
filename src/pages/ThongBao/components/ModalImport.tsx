import UploadFile from '@/components/Upload/UploadFile';
import { dowLoadBieuMauNguoiNhan } from '@/services/ThongBao';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalImport = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	setSelectedUsers: any;
	selectedUsers: any;
	role?: any;
}) => {
	const { visible, setVisible, setSelectedUsers, role, selectedUsers } = props;
	const [form] = Form.useForm();
	const { importNguoiNhanThongBaoModel, formSubmiting } = useModel('thongbao.thongbao');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onDownloadTemplate = () => {
		try {
			dowLoadBieuMauNguoiNhan().then((res: any) => fileDownload(res.data, 'File biểu mẫu.xlsx'));
		} catch (er) {
			console.log('🚀 er:', er);
		}
	};

	const onFinish = async (values: any) => {
		values.file = values?.file?.fileList?.[0].originFileObj;

		importNguoiNhanThongBaoModel(values, role)
			.then((res: any) => {
				const newSelectedUsers = [...selectedUsers, ...res];
				setSelectedUsers(_.uniqBy(newSelectedUsers, (item) => item.code));
				setVisible(false);
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<Modal
			title='Nhập dữ liệu'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={600}
			destroyOnClose
		>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='file' label='Tập tin dữ liệu' rules={[...rules.fileRequired]}>
							<UploadFile accept='.xls, .xlsx' drag buttonDescription='Chọn tập tin dữ liệu để nhập vào hệ thống' />
						</Form.Item>
					</Col>
					<Col span={24} style={{ textAlign: 'center', marginTop: 8 }}>
						<i>Sử dụng tập dữ liệu mẫu để việc xử lý được thực hiện nhanh chóng và chính xác</i>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							Tải tập tin mẫu
						</Button>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>

					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalImport;
