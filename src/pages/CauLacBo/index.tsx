import React, { Suspense } from 'react';
import { Tabs, Spin } from 'antd';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  const items = [
    {
      label: 'Danh sách CLB',
      key: 'clubs',
      children: (
        <Suspense fallback={<Spin />}>
          <ClubListPage />
        </Suspense>
      ),
    },
    {
      label: 'Quản lý đơn đăng ký',
      key: 'applications',
      children: (
        <Suspense fallback={<Spin />}>
          <RegistrationPage />
        </Suspense>
      ),
    },
    {
      label: 'Quản lý thành viên',
      key: 'members',
      children: (
        <Suspense fallback={<Spin />}>
          <MemberPage />
        </Suspense>
      ),
    },
    {
      label: 'Báo cáo & Thống kê',
      key: 'statistics',
      children: (
        <Suspense fallback={<Spin />}>
          <StatisticsPage />
        </Suspense>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Tabs items={items} defaultActiveKey="clubs" />
    </div>
  );
};

export default CauLacBoPage;
