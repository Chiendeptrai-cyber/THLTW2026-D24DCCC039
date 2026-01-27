import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { EReceiverType, EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { ImportOutlined } from '@ant-design/icons';
import { Checkbox, Col, Empty, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GroupTagUsers from './GroupTagUsers';
import ModalImport from './ModalImport';

const TableSelectUser = (props: {
	type: EVaiTroKhaoSat;
	selectedUsers?: ThongBao.IUser[];
	setSelectedUsers?: (val: ThongBao.IUser[]) => void;
	danhSachDoiTuong?: Record<string, string[]>;
	receiverType?: EReceiverType;
}) => {
	const { selectedUsers = [], setSelectedUsers, danhSachDoiTuong, type, receiverType } = props;
	const { page, limit } = useModel(type === EVaiTroKhaoSat.SINH_VIEN ? 'thongbao.sinhvien' : 'thongbao.nhansu');
	const { getCanBoChuChotModel, danhSachCanBo, loading } = useModel('thongbao.nhansu');
	const [checked, setChecked] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);

	const allCanBoInSelected = danhSachCanBo.length
		? danhSachCanBo.every((canBo) => selectedUsers.some((user) => user.username === canBo.username))
		: false;

	useEffect(() => {
		getCanBoChuChotModel();
	}, []);

	const handleCheckBox = (check: boolean) => {
		setChecked(check);
	};

	useEffect(() => {
		if (setSelectedUsers) {
			if (checked === true) {
				const newSelectedUsers = [...selectedUsers, ...danhSachCanBo];
				setSelectedUsers(_.uniqBy(newSelectedUsers, (item) => item.username));
			} else {
				if (allCanBoInSelected) {
					const updatedSelectedUsers = selectedUsers.filter(
						(user) => !danhSachCanBo.some((item) => item.username === user.username),
					);
					setSelectedUsers(updatedSelectedUsers);
				}
			}
		}
	}, [checked]);

	useEffect(() => {
		if (!allCanBoInSelected) {
			setChecked(false);
		} else setChecked(true);
	}, [allCanBoInSelected]);

	const onChange = (keys?: string[], rows?: ThongBao.IUser[]) => {
		const arr = [...selectedUsers, ...(rows ?? [])]?.filter((item) => item !== undefined);
		const obj = arr?.filter((item) => {
			return keys?.includes(item?.username);
		});

		if (setSelectedUsers) setSelectedUsers(_.uniqBy(obj, 'username'));
	};

	const onCell = (recordVal: ThongBao.IUser) => ({
		onClick: () => {
			const arr = [...selectedUsers];
			const obj = arr?.find((item) => {
				return item?.username === recordVal?.username;
			});
			if (obj) {
				arr.forEach((item, index) => {
					if (item?.username === recordVal?.username) {
						arr.splice(index, 1);
					}
				});
			} else {
				arr.push({
					...recordVal,
					vaiTro: type,
				});
			}
			if (setSelectedUsers) setSelectedUsers(arr);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ThongBao.IUser>[] = [
		{
			title: type === EVaiTroKhaoSat.SINH_VIEN ? 'Mã sinh viên' : 'Mã cán bộ',
			dataIndex: 'code',
			filterType: 'string',
			width: 80,
			render: (val, rec) => rec?.username,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			filterType: 'string',
			width: 180,
			onCell,
		},
		type === EVaiTroKhaoSat.SINH_VIEN
			? {
					title: 'Trạng thái học',
					dataIndex: 'trangThaiHoc',
					align: 'center',
					width: 120,
					// filterType: 'select',
					// filterData: Object.values(ETrangThaiHocSv),
					// render: (val, rec) => <Tag color={colorTrangThaiHocSv[val as ETrangThaiHocSv]}>{val}</Tag>,
					onCell,
			  }
			: {
					title: 'Trạng thái',
					dataIndex: 'trangThai',
					align: 'center',
					width: 120,
					// filterType: 'select',
					// filterData: Object.values(ETrangThaiNhanSu),
					// render: (val, rec) => <Tag color={MapColorETrangThaiNhanSu[val as ETrangThaiNhanSu]}>{val}</Tag>,
					onCell,
			  },
	];

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col md={12}>
					<TableBase
						columns={columns}
						dependencies={[page, limit, JSON.stringify(danhSachDoiTuong), type]}
						params={danhSachDoiTuong}
						modelName={type === EVaiTroKhaoSat.SINH_VIEN ? 'thongbao.sinhvien' : 'thongbao.nhansu'}
						hideCard
						buttons={{ create: false, reload: false }}
						otherProps={{
							size: 'small',
							rowKey: 'username',
							rowSelection: {
								selectedRowKeys: selectedUsers?.map((item) => item.username),
								onChange,
								preserveSelectedRowKeys: true,
							},
						}}
						otherButtons={[
							type === EVaiTroKhaoSat.NHAN_VIEN && receiverType === EReceiverType.All ? (
								<Checkbox
									key='check'
									disabled={loading}
									checked={checked}
									onChange={(e) => handleCheckBox(e.target.checked)}
								>
									Cán bộ chủ chốt
								</Checkbox>
							) : (
								<></>
							),
							<ButtonExtend
								key='import'
								icon={<ImportOutlined />}
								onClick={() => setVisibleImport(true)}
								type='default'
								size='small'
							>
								Nhập dữ liệu
							</ButtonExtend>,
						]}
					/>
				</Col>
				<Col md={12}>
					<div style={{ marginBottom: 12 }}>
						{selectedUsers?.length ? (
							<GroupTagUsers users={selectedUsers} setUsers={setSelectedUsers} type={type} />
						) : (
							<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có dữ liệu' />
						)}
					</div>
				</Col>
			</Row>

			<ModalImport
				visible={visibleImport}
				setVisible={setVisibleImport}
				setSelectedUsers={setSelectedUsers}
				selectedUsers={selectedUsers}
				role={type}
			/>
		</>
	);
};

export default TableSelectUser;
