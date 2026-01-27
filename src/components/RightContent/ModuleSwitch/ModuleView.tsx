import {
	AppModules,
	EModuleKey,
	moduleCongThongTin,
	moduleQuanLyVanBan,
	moduleThuVien,
} from '@/services/base/constant';
import type { Login } from '@/services/base/typing';
import { UserSwitchOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useModel } from 'umi';
import './style.less';

const ModuleView = () => {
	const { initialState } = useModel('@@initialState');
	const permissions = initialState?.authorizedPermissions?.map((item) => item.rsname);
	const isCanBo = initialState?.authorizedPermissions?.some(
		(permission) => permission.rsname === EModuleKey.CONG_CAN_BO,
	);
	const extendModules: Partial<Login.TModule>[] = [];
	if (moduleQuanLyVanBan.url && isCanBo) extendModules.push(moduleQuanLyVanBan);
	if (moduleThuVien.url) extendModules.push(moduleThuVien);
	if (moduleCongThongTin.url) extendModules.push(moduleCongThongTin);

	return (
		<div className='module-view'>
			<div className='module-header'>Danh sách chức năng</div>

			<Row gutter={[5, 5]}>
				{Object.entries(AppModules)
					.filter(([name, value]) => permissions?.includes(name as EModuleKey) && !!value.url)
					.map(([name, value]) => (
						<Col span={8} key={name}>
							<a href={value?.url} target='_blank' rel='noreferrer'>
								<div className='module-item'>
									{value?.icon ? (
										<img src={`${AppModules[EModuleKey.QLDT].url}modules/${value.icon}`} />
									) : (
										<UserSwitchOutlined />
									)}
									<span className='module-name'>{value?.title ?? name}</span>
								</div>
							</a>
						</Col>
					))}

				{extendModules.map((mod) => (
					<Col span={8} key={mod.url}>
						<a href={mod.url} target='_blank' rel='noreferrer'>
							<div className='module-item'>
								{mod.icon ? (
									<img src={`${AppModules[EModuleKey.CORE].url}modules/${mod.icon}`} />
								) : (
									<UserSwitchOutlined />
								)}
								<span className='module-name'>{mod.title}</span>
							</div>
						</a>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default ModuleView;
