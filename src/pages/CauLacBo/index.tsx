import React from 'react';
import { Tabs } from 'antd';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  const items = [
    {
      label: 'Danh sách CLB',
      key: 'clubs',
      children: <ClubListPage />,
    },
    {
      label: 'Quản lý đơn đăng ký',
      key: 'applications',
      children: <RegistrationPage />,
    },
    {
      label: 'Quản lý thành viên',
      key: 'members',
      children: <MemberPage />,
    },
    {
      label: 'Báo cáo & Thống kê',
      key: 'statistics',
      children: <StatisticsPage />,
    },
  ];

  return <Tabs items={items} />;
};

export default CauLacBoPage;
