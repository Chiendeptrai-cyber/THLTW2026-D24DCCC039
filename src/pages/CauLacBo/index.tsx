import React, { useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  useEffect(() => {
    console.log('🔍 CauLacBoPage - useEffect mount');
  }, []);

  console.log('🔍 CauLacBoPage - rendering');
  console.log('🔍 Creating tabs items');
  
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

  console.log('🔍 CauLacBoPage - about to render Tabs with items:', items.length);

  return (
    <div style={{ padding: '20px' }}>
      <Tabs items={items} defaultActiveKey="clubs" />
    </div>
  );
};

export default CauLacBoPage;
