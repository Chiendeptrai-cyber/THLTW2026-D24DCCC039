import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('clubs');

  useEffect(() => {
    console.log('🔍 CauLacBoPage - mounted, activeTab:', activeTab);
  }, [activeTab]);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Câu lạc bộ</h1>
      <Tabs 
        items={items} 
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />
    </div>
  );
};

export default CauLacBoPage;
