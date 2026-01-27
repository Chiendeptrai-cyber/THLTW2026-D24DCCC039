import { Tooltip } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from '../NoticeIcon/index.less';
import ModuleView from './ModuleView';

const ModuleSwitch = () => {
  return (
    <HeaderDropdown
      placement="bottomRight"
      overlayClassName={styles.popover}
      overlay={<ModuleView />}
      trigger={['click']}
      arrow
    >
      <Tooltip title="Danh sách chức năng" placement="bottom">
        <a className="module-switch-link">
          <img src="/icon-tien-ich.svg" alt="apps" />
        </a>
      </Tooltip>
    </HeaderDropdown>
  );
};

export default ModuleSwitch;
