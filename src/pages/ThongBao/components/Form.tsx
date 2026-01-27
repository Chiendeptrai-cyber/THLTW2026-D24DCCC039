import FormWaiting from '@/components/Loading/FormWaiting';
import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import {
	EReceiverType,
	EVaiTroKhaoSat,
	LoaiDoiTuongThongBao,
	mapModuleKeyToSourceType,
	NotificationType,
	TenVaiTroKhaoSat,
} from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { buildUpLoadFile, buildUpLoadMultiFile } from '@/services/uploadFile';
import { currentRole } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, message, Modal, Row, Segmented, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GroupTagVaiTro from './GroupTagVaiTro';
import TableSelectUser from './TableSelect';

const FormThongBao = (props: any) => {
	const { title, getData, notiType } = props;
	const [form] = Form.useForm();
	const { record, setFormSubmiting, setVisibleForm, edit, postModel, formSubmiting, visibleForm, putModel } =
		useModel('thongbao.thongbao');
	const { setDanhSachCanBo } = useModel('thongbao.nhansu');
	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<ThongBao.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<ThongBao.IUser[]>([]);
	const roles: EVaiTroKhaoSat[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) || EReceiverType.All;
	const loaiNguoiDung: EReceiverType = Form.useWatch('loaiNguoiDung', form);
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDanhSachCanBo([]);
		} else if (record?._id) form.setFieldsValue(record);
		else {
			setActiveKey(roles?.[0]);
			form.setFieldsValue({
				receiverType: EReceiverType.All,
				loaiNguoiDung: EReceiverType.All,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (formSubmiting) return;
		setFormSubmiting(true);
		try {
			FormWaiting('Đang xử lý dữ liệu');
			const imageUrl = await buildUpLoadFile(values, 'imageUrl');
			const taiLieuDinhKem = await buildUpLoadMultiFile(values, 'taiLieuDinhKem');
			values.imageUrl = imageUrl;
			values.taiLieuDinhKem = taiLieuDinhKem;
			setFormSubmiting(false);

			if (receiverType !== EReceiverType.All) values.filter[`id${receiverType}`] = values.danhSachDoiTuong;
			delete values.danhSachDoiTuong;
			if (loaiNguoiDung === EReceiverType.User) {
				values.userList = [...danhSachNhanSu, ...danhSachSinhVien].map((item) => ({
					ssoId: item.ssoId,
					username: item.code,
					fullname: item.fullname,
					email: item.email,
					email365: item.email365,
				}));
				if (!values.userList?.length) {
					message.warn('Vui lòng chọn người nhận');
					return;
				}
			}
			values.notificationInternal = false;

			values.type = notiType;
			values.sourceType = mapModuleKeyToSourceType[currentRole];
			delete values.loaiNguoiDung;

			if (edit) {
				putModel(record?._id ?? '', values, getData)
					.then()
					.catch((er) => console.log(er));
			} else {
				await postModel(values, () => {
					getData();
				})
					.then(() => {
						setDanhSachNhanSu([]);
						setDanhSachSinhVien([]);
					})
					.catch((er) => console.log(er));
			}
		} catch (er) {
			console.log(er);
		} finally {
			setFormSubmiting(false);
			Modal.destroyAll();
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					{notiType === NotificationType.ONESIGNAL && (
						<Col span={24} md={6}>
							<Form.Item name='imageUrl' label='Ảnh đại diện'>
								<UploadFile isAvatarSmall />
							</Form.Item>
						</Col>
					)}
					<Col span={24} md={notiType === NotificationType.ONESIGNAL ? 18 : 24}>
						<Row gutter={[12, 0]}>
							<Col span={notiType === NotificationType.ONESIGNAL ? 24 : 12}>
								<Form.Item
									name='title'
									label='Tiêu đề'
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<Input placeholder='Nhập tiêu đề' />
								</Form.Item>
							</Col>
							{notiType === NotificationType.EMAIL && (
								<Col span={12}>
									<Form.Item name='idTagEmail' label='Nhãn dán' rules={[...rules.required]}>
										{/* <SelectTag />  Tùy chỉnh trong từng phân hệ */}
									</Form.Item>
								</Col>
							)}
							<Col span={24}>
								<Form.Item name='description' label='Mô tả' rules={[...rules.text, ...rules.length(500)]}>
									<Input.TextArea rows={3} placeholder='Nhập mô tả' />
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							name='receiverType'
							label={notiType === NotificationType.ONESIGNAL ? 'Đối tượng nhận thông báo' : 'Đối tượng nhận email'}
							rules={[...rules.required]}
						>
							<Select
								options={Object.entries(LoaiDoiTuongThongBao)
									.filter(([value]) => value !== EReceiverType.User)
									.map(([value, label]) => ({
										key: value,
										value,
										label,
									}))}
								placeholder='Chọn nhóm người nhận'
								onChange={() => {
									form.setFieldsValue({
										filter: { roles: [] },
										danhSachDoiTuong: [],
									});
									setDanhSachNhanSu([]);
									setDanhSachSinhVien([]);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name={['filter', 'roles']} label='Vai trò' rules={[...rules.required]}>
							<GroupTagVaiTro
								onChange={(arr) => {
									setActiveKey(
										arr?.length === 2 && loaiNguoiDung === EReceiverType.All ? EVaiTroKhaoSat.SINH_VIEN : arr?.[0],
									);
									if (!arr.includes(EVaiTroKhaoSat.SINH_VIEN)) setDanhSachSinhVien([]);
									if (!arr.includes(EVaiTroKhaoSat.NHAN_VIEN)) setDanhSachNhanSu([]);
								}}
								listVaiTro={
									[EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
										? [EVaiTroKhaoSat.SINH_VIEN]
										: receiverType === EReceiverType.Khoa
										? [EVaiTroKhaoSat.NHAN_VIEN]
										: undefined
								}
							/>
						</Form.Item>
					</Col>
					{roles?.length ? (
						<Col span={24} md={8}>
							<Form.Item name='loaiNguoiDung' label='Danh sách người dùng'>
								<Segmented
									onChange={() => setDanhSachNhanSu([])}
									options={[
										{ value: EReceiverType.All, label: 'Tất cả' },
										{ value: EReceiverType.User, label: 'Người dùng cụ thể' },
									]}
								/>
							</Form.Item>
						</Col>
					) : null}

					{/* Tùy chỉnh cho từng phân hệ */}
					{/* {receiverType !== EReceiverType.All ? (
						<Col span={24}>
							<Form.Item name='danhSachDoiTuong' label={LoaiDoiTuongThongBao[receiverType]} rules={[...rules.required]}>
								{receiverType === EReceiverType.Khoa ? (
									<SelectDonVi multiple fieldValue='_id' />
								) : receiverType === EReceiverType.KhoaSinhVien ? (
									<SelectKhoaSinhVien multiple />
								) : receiverType === EReceiverType.LopHanhChinh ? (
									<SelectLopHanhChinhDebounce multiple />
								) : receiverType === EReceiverType.LopHocPhan ? (
									<SelectLopHocPhanDebounce multiple />
								) : receiverType === EReceiverType.Nganh ? (
									<SelectNganhCoSo multiple />
								) : null}
							</Form.Item>
						</Col>
					) : null} */}

					{roles?.length ? (
						<>
							{loaiNguoiDung === EReceiverType.User ? (
								<Col span={24} style={{ marginBottom: 12 }}>
									<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
										{Object.values(EVaiTroKhaoSat).map((item) =>
											roles.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroKhaoSat[item]} /> : null,
										)}
									</Tabs>

									{activeKey === EVaiTroKhaoSat.SINH_VIEN ? (
										<TableSelectUser
											type={EVaiTroKhaoSat.SINH_VIEN}
											selectedUsers={danhSachSinhVien}
											setSelectedUsers={setDanhSachSinhVien}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
											receiverType={receiverType}
										/>
									) : activeKey === EVaiTroKhaoSat.NHAN_VIEN ? (
										<TableSelectUser
											type={EVaiTroKhaoSat.NHAN_VIEN}
											selectedUsers={danhSachNhanSu}
											setSelectedUsers={setDanhSachNhanSu}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
											receiverType={receiverType}
										/>
									) : null}
								</Col>
							) : null}
						</>
					) : null}

					<Col span={24}>
						<Form.Item
							name='content'
							label={
								notiType === NotificationType.ONESIGNAL ? 'Nội dung chi tiết thông báo' : 'Nội dung chi tiết email'
							}
							rules={[...rules.requiredHtml]}
						>
							<TinyEditor height={300} hideMenubar />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='taiLieuDinhKem' label='Tệp đính kèm'>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='thoiGianHieuLuc' label='Hiệu lực thông báo'>
							<MyDatePicker />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongBao;
