import { useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  BarChartOutlined, EnvironmentOutlined, DollarOutlined,
  CalendarOutlined, RiseOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import LineChart from '@/components/Chart/LineChart';
import './style.less';

const { Title } = Typography;

const ThongKe: React.FC = () => {
  const { thongKe, getThongKe, lichTrinhs, getLichTrinhs, diemDens, getDiemDens } = useModel('dulich');

  useEffect(() => {
    getDiemDens();
    getLichTrinhs();
    getThongKe();
  }, []);

  const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

  const tongDoanhThu = thongKe?.doanhThu?.reduce((sum, d) => sum + d.soTien, 0) || 0;
  const tongLichTrinh = lichTrinhs.length;
  const tongDiemDen = diemDens.length;

  return (
    <div className='thong-ke-page'>
      <div className='page-header'>
        <h1>📊 Thống kê tổng quan</h1>
        <p>Theo dõi hoạt động và hiệu quả hệ thống du lịch</p>
      </div>

      {/* Tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card className='stat-card stat-blue'>
            <Statistic
              title='Tổng lịch trình'
              value={tongLichTrinh}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='stat-card stat-green'>
            <Statistic
              title='Tổng điểm đến'
              value={tongDiemDen}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='stat-card stat-orange'>
            <Statistic
              title='Tổng doanh thu'
              value={tongDoanhThu}
              formatter={(val) => formatVND(Number(val))}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='stat-card stat-purple'>
            <Statistic
              title='TB doanh thu/tháng'
              value={tongDoanhThu > 0 ? Math.round(tongDoanhThu / 6) : 0}
              formatter={(val) => formatVND(Number(val))}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ hàng 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card title='Lịch trình được tạo theo tháng'>
            {thongKe?.lichTrinhTheoThang && (
              <ColumnChart
                xAxis={thongKe.lichTrinhTheoThang.map((t) => t.thang)}
                yAxis={[thongKe.lichTrinhTheoThang.map((t) => t.soLuong)]}
                yLabel={['Số lịch trình']}
                colors={['#1890ff']}
                height={300}
                formatY={(val) => val.toString()}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title='Doanh thu theo tháng'>
            {thongKe?.doanhThu && (
              <LineChart
                xAxis={thongKe.doanhThu.map((d) => d.thang)}
                yAxis={[thongKe.doanhThu.map((d) => d.soTien)]}
                yLabel={['Doanh thu']}
                colors={['#52c41a']}
                height={300}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ hàng 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title='Địa điểm phổ biến nhất'>
            {thongKe?.diaDiemPhoBien && thongKe.diaDiemPhoBien.length > 0 && (
              <ColumnChart
                xAxis={thongKe.diaDiemPhoBien.map((d) => d.ten)}
                yAxis={[thongKe.diaDiemPhoBien.map((d) => d.soLuot)]}
                yLabel={['Số lượt']}
                colors={['#fa8c16']}
                height={300}
                formatY={(val) => val.toString()}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title='Chi phí theo hạng mục'>
            {thongKe?.chiPhiTheoHangMuc && (
              <DonutChart
                xAxis={thongKe.chiPhiTheoHangMuc.map((c) => c.hangMuc)}
                yAxis={[thongKe.chiPhiTheoHangMuc.map((c) => c.soTien)]}
                yLabel={['Chi phí']}
                colors={['#fa8c16', '#1890ff', '#722ed1']}
                showTotal
                height={300}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKe;
