import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { AppModules } from '@/services/base/constant';
import type { NotificationType } from '@/services/ThongBao/constant';
import type { ThongBao } from '@/services/ThongBao/typing';
import { currentRole } from '@/utils/ip';
import { Button } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ConfirmThongBaoTuyChinh = (props: { getData: () => void; type: NotificationType }) => {
	const { getData, type } = props;
	const {
		formSubmiting,
		recordThongBaoDanhSach,
		guiThongBaoDanhSachModal,
		setVisibleThongBaoDanhSach,
		danhSachThongBaoDanhSach,
	} = useModel('thongbao.thongbao');

	const handleGui = async () => {
		await guiThongBaoDanhSachModal(
			recordThongBaoDanhSach?.file,
			type,
			recordThongBaoDanhSach.title,
			recordThongBaoDanhSach.content,
			AppModules[currentRole].title,
			recordThongBaoDanhSach.vaiTroNguoiNhan,
			'1',
			getData,
		)
			.then(() => setVisibleThongBaoDanhSach(false))
			.catch((err) => console.log(err));
	};

	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Người nhận',
			width: 250,
			render: (val, rec) => `${rec?.userList[0]?.fullname} - ${rec?.userList[0]?.code}`,
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			width: 280,
			render: (val) => (
				<ExpandText>
					<div dangerouslySetInnerHTML={{ __html: val ?? '' }} className='notif-content' />
				</ExpandText>
			),
		},
		{
			title: 'Thời gian gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSachThongBaoDanhSach ?? []}
				addStt
				hasTotal
				otherProps={{ pagination: true }}
			/>

			<div className='form-footer'>
				<Button loading={formSubmiting} onClick={() => handleGui()} type='primary'>
					Gửi thông báo
				</Button>
				<Button onClick={() => setVisibleThongBaoDanhSach(false)}>Hủy</Button>
			</div>
		</>
	);
};

export default ConfirmThongBaoTuyChinh;
