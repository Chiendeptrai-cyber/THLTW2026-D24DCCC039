import { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Input, Select, Rate, Tag, Empty, Slider, Spin } from 'antd';
import { EnvironmentOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import { useModel } from 'umi';
import './style.less';

const { Meta } = Card;
const { Option } = Select;

const LOAI_MAP: Record<string, { label: string; color: string }> = {
  bien: { label: 'Biển', color: 'blue' },
  nui: { label: 'Núi', color: 'green' },
  thanhpho: { label: 'Thành phố', color: 'orange' },
};

const KhamPhaDiemDen: React.FC = () => {
  const { diemDens, getDiemDens, loading } = useModel('dulich');
  const [search, setSearch] = useState('');
  const [loaiFilter, setLoaiFilter] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('danhGia');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  useEffect(() => {
    getDiemDens();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...diemDens];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (d) => d.ten.toLowerCase().includes(s) || d.diaChi.toLowerCase().includes(s),
      );
    }

    if (loaiFilter) {
      result = result.filter((d) => d.loai === loaiFilter);
    }

    const [min, max] = priceRange;
    result = result.filter((d) => {
      const total = d.chiPhi.anUong + d.chiPhi.luuTru + d.chiPhi.diChuyen;
      return total >= min && total <= max;
    });

    if (sortBy === 'danhGia') {
      result.sort((a, b) => b.danhGia - a.danhGia);
    } else if (sortBy === 'giaThap') {
      result.sort(
        (a, b) =>
          a.chiPhi.anUong + a.chiPhi.luuTru + a.chiPhi.diChuyen -
          (b.chiPhi.anUong + b.chiPhi.luuTru + b.chiPhi.diChuyen),
      );
    } else if (sortBy === 'giaCao') {
      result.sort(
        (a, b) =>
          b.chiPhi.anUong + b.chiPhi.luuTru + b.chiPhi.diChuyen -
          (a.chiPhi.anUong + a.chiPhi.luuTru + a.chiPhi.diChuyen),
      );
    }

    return result;
  }, [diemDens, search, loaiFilter, sortBy, priceRange]);

  const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

  return (
    <div className='kham-pha-page'>
      <div className='page-header'>
        <h1>🌍 Khám phá điểm đến</h1>
        <p>Tìm kiếm và khám phá những địa điểm du lịch tuyệt vời tại Việt Nam</p>
      </div>

      <Card className='filter-card'>
        <Row gutter={[16, 16]} align='middle'>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder='Tìm kiếm điểm đến...'
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder='Loại hình'
              value={loaiFilter}
              onChange={setLoaiFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value='bien'>🏖️ Biển</Option>
              <Option value='nui'>⛰️ Núi</Option>
              <Option value='thanhpho'>🏙️ Thành phố</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value='danhGia'>⭐ Đánh giá cao nhất</Option>
              <Option value='giaThap'>💰 Giá thấp → cao</Option>
              <Option value='giaCao'>💰 Giá cao → thấp</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div>
              <span style={{ marginRight: 8, fontSize: 13 }}>Khoảng giá:</span>
              <Slider
                range
                min={0}
                max={5000000}
                step={100000}
                value={priceRange}
                onChange={(val) => setPriceRange(val as [number, number])}
                tipFormatter={(val) => formatVND(val || 0)}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {filteredData.length === 0 ? (
          <Empty description='Không tìm thấy điểm đến phù hợp' style={{ marginTop: 40 }} />
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {filteredData.map((dd) => {
              const totalCost = dd.chiPhi.anUong + dd.chiPhi.luuTru + dd.chiPhi.diChuyen;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={dd.id}>
                  <Card
                    hoverable
                    className='destination-card'
                    cover={
                      <div className='card-cover'>
                        <img
                          alt={dd.ten}
                          src={dd.hinhAnh}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x250?text=No+Image';
                          }}
                        />
                        <Tag
                          color={LOAI_MAP[dd.loai]?.color}
                          className='type-tag'
                        >
                          {LOAI_MAP[dd.loai]?.label}
                        </Tag>
                      </div>
                    }
                  >
                    <Meta
                      title={<span className='card-title'>{dd.ten}</span>}
                      description={
                        <div className='card-desc'>
                          <div className='card-location'>
                            <EnvironmentOutlined /> {dd.diaChi}
                          </div>
                          <div className='card-rating'>
                            <StarFilled style={{ color: '#fadb14' }} /> {dd.danhGia}
                            <Rate disabled value={dd.danhGia} allowHalf style={{ fontSize: 12, marginLeft: 4 }} />
                          </div>
                          <div className='card-price'>
                            💰 {formatVND(totalCost)} / ngày
                          </div>
                          <div className='card-time'>
                            🕐 {dd.thoiGianThamQuan}h tham quan
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default KhamPhaDiemDen;
