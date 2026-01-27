import { EModuleKey } from '@/services/base/constant';
import { type ESourceTypeNotification, mapModuleKey } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { currentRole } from '@/utils/ip';
import { getNameFile } from '@/utils/utils';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void; hideCard?: boolean }) => {
	const { record, afterViewDetail, hideCard } = props;

	const redirectNotif = () => {
		const urlMap: Record<EModuleKey, string> = {
			[EModuleKey.CONNECT]: APP_CONFIG_URL_CONNECT,
			[EModuleKey.CONG_CAN_BO]: APP_CONFIG_URL_CAN_BO,
			[EModuleKey.QLDT]: APP_CONFIG_URL_DAO_TAO,
			[EModuleKey.CORE]: APP_CONFIG_URL_CORE,
			[EModuleKey.TCNS]: APP_CONFIG_URL_NHAN_SU,
			[EModuleKey.CTSV]: APP_CONFIG_URL_CTSV,
			[EModuleKey.VPS]: APP_CONFIG_URL_VPS,
			[EModuleKey.TC]: APP_CONFIG_URL_TAI_CHINH,
			[EModuleKey.QLKH]: APP_CONFIG_URL_QLKH,
			[EModuleKey.KT]: APP_CONFIG_URL_KHAO_THI,
			[EModuleKey.CSVC]: APP_CONFIG_URL_CSVC,
		};

		const sourceType = mapModuleKey[record?.sourceType as ESourceTypeNotification];
		const sourceModule = mapModuleKey[record?.metadata?.phanHe as ESourceTypeNotification];

		if (sourceType === currentRole) {
			if (afterViewDetail) afterViewDetail();
			history.push(`/${record?.metadata?.pathWeb}`);
		} else {
			const baseUrl = urlMap[sourceModule as EModuleKey];
			if (baseUrl && record?.metadata?.pathWeb) {
				const pathWeb = record.metadata.pathWeb.replace(/^\/+/, ''); // Loại bỏ dấu '/' ở đầu chuỗi pathWeb nếu có
				window.open(baseUrl + pathWeb, '_blank');
			}
		}
	};

	const content = (
		<>
			<Card.Meta
				avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} size='large' /> : false}
				description={
					<>
						<div style={{ marginBottom: 8 }}>{record?.description}</div>
						<UserOutlined /> {record?.senderName ?? ''} <Divider type='vertical' />
						<CalendarOutlined /> {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
					</>
				}
			/>
			<br />
			<div dangerouslySetInnerHTML={{ __html: record?.content ?? '' }} className='notif-content' />
			<Row style={{ marginTop: 12 }} gutter={[12, 12]}>
				{record?.taiLieuDinhKem?.length ? (
					<>
						<Col span={24}>Tệp đính kèm: </Col>
						{record?.taiLieuDinhKem?.map((item) => (
							<Col span={24} key={item}>
								<a href={item} target='_blank' rel='noreferrer'>
									{getNameFile(item)}
								</a>
							</Col>
						))}
					</>
				) : null}

				{record?.thoiGianHieuLuc ? (
					<Col span={24}>
						Hiệu lực thông báo: <b style={{ color: 'red' }}>{moment(record?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b>{' '}
					</Col>
				) : null}

				{record?.metadata?.pathWeb && record?.metadata?.phanHe ? (
					<Col span={24}>
						<Button type='primary' onClick={() => redirectNotif()}>
							Xem chi tiết
						</Button>
					</Col>
				) : null}
			</Row>
		</>
	);

	if (hideCard) return content;
	return <Card title={record?.title}>{content}</Card>;
};

export default ViewThongBao;
