import { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Alert, Statistic, Empty, Progress, Typography } from 'antd';
import {
  DollarOutlined, CoffeeOutlined, CarOutlined, HomeOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { tinhChiPhiLichTrinh } from '@/services/DuLich';
import DonutChart from '@/components/Chart/DonutChart';
import ColumnChart from '@/components/Chart/ColumnChart';
import './style.less';

const { Title, Text } = Typography;

const NganSach: React.FC = () => {
  const { lichTrinhs, getLichTrinhs, diemDens, getDiemDens } = useModel('dulich');
  const [selectedLT, setSelectedLT] = useState<string | undefined>();

  useEffect(() => {
    getDiemDens();
    getLichTrinhs();
  }, []);

  const lichTrinh = lichTrinhs.find((lt) => lt.id === selectedLT);
  const chiPhi = lichTrinh ? tinhChiPhiLichTrinh(lichTrinh) : null;

  const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

  // Tính chi phí theo ngày cho biểu đồ
  const chartDataByDay = () => {
    if (!lichTrinh) return null;
    const xAxis = lichTrinh.ngays.map((n) => `Ngày ${n.ngay}`);
    const anUong: number[] = [];
    const luuTru: number[] = [];
    const diChuyen: number[] = [];

    lichTrinh.ngays.forEach((ngay) => {
      let au = 0, lt = 0, dc = 0;
      ngay.diemDens.forEach((dd) => {
        const info = diemDens.find((d) => d.id === dd.diemDenId);
        if (info) {
          au += info.chiPhi.anUong;
          lt += info.chiPhi.luuTru;
          dc += info.chiPhi.diChuyen;
        }
      });
      anUong.push(au);
      luuTru.push(lt);
      diChuyen.push(dc);
    });

    return { xAxis, yAxis: [anUong, luuTru, diChuyen], yLabel: ['Ăn uống', 'Lưu trú', 'Di chuyển'] };
  };

  const barData = chartDataByDay();
  const budgetPercent = lichTrinh && lichTrinh.nganSachDuKien > 0
    ? Math.round(((chiPhi?.tongChi || 0) / lichTrinh.nganSachDuKien) * 100)
    : 0;

  return (
    <div className='ngan-sach-page'>
      <div className='page-header'>
        <h1>💰 Quản lý ngân sách</h1>
        <p>Theo dõi chi phí và phân bổ ngân sách cho chuyến đi</p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align='middle'>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder='Chọn lịch trình...'
              style={{ width: '100%' }}
              value={selectedLT}
              onChange={setSelectedLT}
              options={lichTrinhs.map((lt) => ({
                value: lt.id,
                label: `${lt.ten} (${lt.ngays?.length || 0} ngày)`,
              }))}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {!lichTrinh ? (
        <Card>
          <Empty description='Chọn một lịch trình để xem ngân sách' />
        </Card>
      ) : (
        <>
          {/* Cảnh báo vượt ngân sách */}
          {chiPhi?.vuotNganSach && (
            <Alert
              type='error'
              showIcon
              icon={<ExclamationCircleOutlined />}
              message='Vượt ngân sách!'
              description={`Bạn đã chi vượt ${formatVND(chiPhi.soTienVuot)} so với ngân sách dự kiến ${formatVND(lichTrinh.nganSachDuKien)}.`}
              style={{ marginBottom: 16 }}
              closable
            />
          )}

          {!chiPhi?.vuotNganSach && chiPhi && chiPhi.tongChi > 0 && (
            <Alert
              type='success'
              showIcon
              icon={<CheckCircleOutlined />}
              message='Ngân sách hợp lý'
              description={`Bạn còn ${formatVND(lichTrinh.nganSachDuKien - chiPhi.tongChi)} trong ngân sách.`}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Tổng quan */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Card className='stat-card'>
                <Statistic
                  title='Ngân sách dự kiến'
                  value={lichTrinh.nganSachDuKien}
                  formatter={(val) => formatVND(Number(val))}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='stat-card'>
                <Statistic
                  title='Chi phí ăn uống'
                  value={chiPhi?.tongAnUong || 0}
                  formatter={(val) => formatVND(Number(val))}
                  prefix={<CoffeeOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='stat-card'>
                <Statistic
                  title='Chi phí lưu trú'
                  value={chiPhi?.tongLuuTru || 0}
                  formatter={(val) => formatVND(Number(val))}
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='stat-card'>
                <Statistic
                  title='Chi phí di chuyển'
                  value={chiPhi?.tongDiChuyen || 0}
                  formatter={(val) => formatVND(Number(val))}
                  prefix={<CarOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Tiến trình ngân sách */}
          <Card style={{ marginBottom: 16 }}>
            <Title level={5}>Mức sử dụng ngân sách</Title>
            <Progress
              percent={Math.min(budgetPercent, 100)}
              status={chiPhi?.vuotNganSach ? 'exception' : 'active'}
              strokeColor={budgetPercent > 100 ? '#f5222d' : budgetPercent > 80 ? '#fa8c16' : '#52c41a'}
              format={() => `${budgetPercent}%`}
            />
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={8}>
                <Text type='secondary'>Đã chi: <strong>{formatVND(chiPhi?.tongChi || 0)}</strong></Text>
              </Col>
              <Col span={8}>
                <Text type='secondary'>Ngân sách: <strong>{formatVND(lichTrinh.nganSachDuKien)}</strong></Text>
              </Col>
              <Col span={8}>
                <Text type='secondary'>
                  Còn lại: <strong style={{ color: chiPhi?.vuotNganSach ? '#f5222d' : '#52c41a' }}>
                    {chiPhi?.vuotNganSach ? '-' : ''}{formatVND(Math.abs(lichTrinh.nganSachDuKien - (chiPhi?.tongChi || 0)))}
                  </strong>
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Biểu đồ */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title='Phân bổ ngân sách theo hạng mục'>
                <DonutChart
                  xAxis={['Ăn uống', 'Lưu trú', 'Di chuyển']}
                  yAxis={[[chiPhi?.tongAnUong || 0, chiPhi?.tongLuuTru || 0, chiPhi?.tongDiChuyen || 0]]}
                  yLabel={['Chi phí']}
                  colors={['#fa8c16', '#1890ff', '#722ed1']}
                  showTotal
                  height={320}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title='Chi phí theo ngày'>
                {barData && barData.xAxis.length > 0 ? (
                  <ColumnChart
                    xAxis={barData.xAxis}
                    yAxis={barData.yAxis}
                    yLabel={barData.yLabel}
                    colors={['#fa8c16', '#1890ff', '#722ed1']}
                    height={320}
                  />
                ) : (
                  <Empty description='Chưa có dữ liệu' />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default NganSach;
