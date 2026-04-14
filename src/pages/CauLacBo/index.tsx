import React from 'react';
import { Tabs, Card } from 'antd';
import { TeamOutlined, FormOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';
import ClubListPage from './ClubList';
import RegistrationPage from './RegistrationList';
import MemberPage from './MemberList';
import StatisticsPage from './Statistics';

const CauLacBoPage: React.FC = () => {
  const items = [
    {
      label: (
        <span>
          <TeamOutlined />
          Danh sách CLB
        </span>
      ),
      key: 'clubs',
      children: <ClubListPage />,
    },
    {
      label: (
        <span>
          <FormOutlined />
          Đơn đăng ký
        </span>
      ),
      key: 'applications',
      children: <RegistrationPage />,
    },
    {
      label: (
        <span>
          <UserOutlined />
          Thành viên
        </span>
      ),
      key: 'members',
      children: <MemberPage />,
    },
    {
      label: (
        <span>
          <BarChartOutlined />
          Báo cáo & Thống kê
        </span>
      ),
      key: 'statistics',
      children: <StatisticsPage />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs items={items} defaultActiveKey="clubs" size="large" />
      </Card>
    </div>
  );
};

export default CauLacBoPage;
