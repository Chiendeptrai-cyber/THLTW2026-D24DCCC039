import React, { useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
} from 'antd';
import { connect } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import type { CauLacBoState } from '@/models/cauLacBo';

interface StatisticsPageProps {
  cauLacBo?: CauLacBoState;
  dispatch?: any;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ cauLacBo = {}, dispatch }) => {
  const { statistics = null, loading = false } = cauLacBo;

  useEffect(() => {
    dispatch?.({ type: 'cauLacBo/getStatistics' });
  }, []);

  if (loading || !statistics) {
    return <Spin spinning={loading} />;
  }

  // Prepare data for column chart
  const chartData = statistics.applicationsByClub.map((item) => item.clubName);
  const pendingData = statistics.applicationsByClub.map((item) => item.pending);
  const approvedData = statistics.applicationsByClub.map((item) => item.approved);
  const rejectedData = statistics.applicationsByClub.map((item) => item.rejected);

  return (
    <div>
      <Card title="Báo cáo và thống kê" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số CLB"
                value={statistics.totalClubs}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đơn chờ duyệt"
                value={statistics.totalApplications.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đơn đã duyệt"
                value={statistics.totalApplications.approved}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đơn bị từ chối"
                value={statistics.totalApplications.rejected}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Thống kê đơn đăng ký theo CLB">
        <ColumnChart
          title="Số đơn đăng ký theo trạng thái và CLB"
          xAxis={chartData}
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

export default connect(({ cauLacBo }) => ({ cauLacBo }))(StatisticsPage);
