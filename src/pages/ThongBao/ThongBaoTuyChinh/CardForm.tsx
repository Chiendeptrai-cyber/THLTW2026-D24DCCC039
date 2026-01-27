import type { NotificationType } from '@/services/ThongBao/constant';
import { Modal, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ConfirmThongBaoTuyChinh from './Confirm';
import FormThongBaoTuyChinh from './Form';

const CardFormThongBaoTuyChinh = (props: { getData: () => void; type: NotificationType }) => {
	const { getData, type } = props;
	const { visibleThongBaoDanhSach, setVisibleThongBaoDanhSach, recordThongBaoDanhSach } = useModel('thongbao.thongbao');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [recordThongBaoDanhSach?.title]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Modal
			title='Gửi thông báo tùy chỉnh'
			visible={visibleThongBaoDanhSach}
			onCancel={() => setVisibleThongBaoDanhSach(false)}
			footer={null}
			width={900}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={recordThongBaoDanhSach?.title ? onChangeStep : undefined}
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Xác nhận gửi thông báo' disabled={!recordThongBaoDanhSach?.title} />
			</Steps>

			{currentStep === 0 ? (
				<FormThongBaoTuyChinh afterAddNew={() => setCurrentStep(1)} type={type} />
			) : (
				<ConfirmThongBaoTuyChinh getData={getData} type={type} />
			)}
		</Modal>
	);
};

export default CardFormThongBaoTuyChinh;
