import { type ThongBao } from '@/services/ThongBao/typing';
import { Card } from 'antd';
import ViewThongBao from '../components/ViewThongBao';

const ViewThongBaoCard = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void }) => {
	const { record, afterViewDetail } = props;

	return (
		<Card title={record?.title} bodyStyle={{ paddingTop: 5 }}>
			<ViewThongBao record={record} afterViewDetail={afterViewDetail} hideCard />
		</Card>
	);
};

export default ViewThongBaoCard;
