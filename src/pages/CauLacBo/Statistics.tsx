import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import type { CauLacBoState } from '@/models/cauLacBo';

interface StatisticsPageProps {
  cauLacBo: CauLacBoState;
  dispatch: any;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ cauLacBo, dispatch }) => {
  const { statistics = null, loading = false } = cauLacBo || {};

  useEffect(() => {
    dispatch({ type: 'cauLacBo/getStatistics' });
    dispatch({ type: 'cauLacBo/getClubs' });
    dispatch({ type: 'cauLacBo/getApplications' });
  }, []);

  if (loading && !statistics) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const chartCategories = statistics.applicationsByClub.map((item) => item.clubName);
  const pendingData = statistics.applicationsByClub.map((item) => item.pending);
  const approvedData = statistics.applicationsByClub.map((item) => item.approved);
  const rejectedData = statistics.applicationsByClub.map((item) => item.rejected);

  return (
    <div>
      <Card title="Tổng quan" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Tổng số CLB"
                value={statistics.totalClubs}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Đơn chờ duyệt"
                value={statistics.totalApplications.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Đơn đã duyệt"
                value={statistics.totalApplications.approved}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Đơn bị từ chối"
                value={statistics.totalApplications.rejected}
                valueStyle={{ color: '#f5222d' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Thống kê đơn đăng ký theo từng CLB">
        <ColumnChart
          title="Số đơn đăng ký theo trạng thái"
          xAxis={chartCategories}
          yAxis={[pendingData, approvedData, rejectedData]}
          yLabel={['Chờ duyệt', 'Đã duyệt', 'Từ chối']}
          height={400}
          colors={['#faad14', '#52c41a', '#f5222d']}
          type="bar"
          formatY={(val: number) => val.toString()}
        />
      </Card>
    </div>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(StatisticsPage);
