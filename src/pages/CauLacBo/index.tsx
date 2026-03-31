import React, { useState } from 'react';
import { Tabs, Spin } from 'antd';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('clubs');

  const tabItems = [
    {
      key: 'clubs',
      label: 'Danh sách CLB',
      children: <ClubListPage />,
    },
    {
      key: 'applications',
      label: 'Quản lý đơn đăng ký',
      children: <RegistrationPage />,
    },
    {
      key: 'members',
      label: 'Quản lý thành viên',
      children: <MemberPage />,
    },
    {
      key: 'statistics',
      label: 'Báo cáo & Thống kê',
      children: <StatisticsPage />,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Tabs 
        items={tabItems}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
    </div>
  );
};

export default CauLacBoPage;
