import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Button, Modal, Form, Input, InputNumber, Select, List, Tag,
  Popconfirm, message, Empty, Collapse, Tooltip, Alert, Typography,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, CalendarOutlined,
  EnvironmentOutlined, DollarOutlined, ClockCircleOutlined,
  ArrowUpOutlined, ArrowDownOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { tinhChiPhiLichTrinh } from '@/services/DuLich';
import './style.less';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const LichTrinh: React.FC = () => {
  const {
    diemDens, getDiemDens, lichTrinhs, getLichTrinhs,
    lichTrinhHienTai, setLichTrinhHienTai,
    themLichTrinh, suaLichTrinh, xoaLichTrinh,
  } = useModel('dulich');

  const [visibleNew, setVisibleNew] = useState(false);
  const [formNew] = Form.useForm();

  useEffect(() => {
    getDiemDens();
    getLichTrinhs();
  }, []);

  const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

  // Tạo lịch trình mới
  const handleCreateLichTrinh = (values: any) => {
    const soNgay = values.soNgay || 1;
    const ngays: DuLich.NgayLichTrinh[] = [];
    for (let i = 1; i <= soNgay; i++) {
      ngays.push({ ngay: i, diemDens: [] });
    }
    const lt = themLichTrinh({
      ten: values.ten,
      nganSachDuKien: values.nganSachDuKien || 0,
      ngays,
    });
    setLichTrinhHienTai(lt);
    setVisibleNew(false);
    formNew.resetFields();
    message.success('Tạo lịch trình thành công!');
  };

  // Thêm điểm đến vào ngày
  const handleAddDiemDen = (ngayIndex: number, diemDenId: string) => {
    if (!lichTrinhHienTai) return;
    const updated = { ...lichTrinhHienTai };
    const ngay = { ...updated.ngays[ngayIndex] };
    const exists = ngay.diemDens.some((dd) => dd.diemDenId === diemDenId);
    if (exists) {
      message.warning('Điểm đến đã có trong ngày này!');
      return;
    }
    ngay.diemDens = [
      ...ngay.diemDens,
      {
        id: Date.now().toString(),
        diemDenId,
        thuTu: ngay.diemDens.length + 1,
      },
    ];
    updated.ngays = [...updated.ngays];
    updated.ngays[ngayIndex] = ngay;
    suaLichTrinh(updated.id, { ngays: updated.ngays });
    setLichTrinhHienTai({ ...updated });
    message.success('Đã thêm điểm đến!');
  };

  // Xóa điểm đến khỏi ngày
  const handleRemoveDiemDen = (ngayIndex: number, diemDenItemId: string) => {
    if (!lichTrinhHienTai) return;
    const updated = { ...lichTrinhHienTai };
    const ngay = { ...updated.ngays[ngayIndex] };
    ngay.diemDens = ngay.diemDens.filter((dd) => dd.id !== diemDenItemId);
    ngay.diemDens = ngay.diemDens.map((dd, i) => ({ ...dd, thuTu: i + 1 }));
    updated.ngays = [...updated.ngays];
    updated.ngays[ngayIndex] = ngay;
    suaLichTrinh(updated.id, { ngays: updated.ngays });
    setLichTrinhHienTai({ ...updated });
  };

  // Đổi thứ tự điểm đến
  const handleReorder = (ngayIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (!lichTrinhHienTai) return;
    const updated = { ...lichTrinhHienTai };
    const ngay = { ...updated.ngays[ngayIndex] };
    const items = [...ngay.diemDens];
    const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    [items[itemIndex], items[swapIndex]] = [items[swapIndex], items[itemIndex]];
    items.forEach((dd, i) => (dd.thuTu = i + 1));
    ngay.diemDens = items;
    updated.ngays = [...updated.ngays];
    updated.ngays[ngayIndex] = ngay;
    suaLichTrinh(updated.id, { ngays: updated.ngays });
    setLichTrinhHienTai({ ...updated });
  };

  // Thêm ngày
  const handleAddDay = () => {
    if (!lichTrinhHienTai) return;
    const updated = { ...lichTrinhHienTai };
    updated.ngays = [
      ...updated.ngays,
      { ngay: updated.ngays.length + 1, diemDens: [] },
    ];
    suaLichTrinh(updated.id, { ngays: updated.ngays });
    setLichTrinhHienTai({ ...updated });
  };

  // Xóa ngày
  const handleRemoveDay = (ngayIndex: number) => {
    if (!lichTrinhHienTai) return;
    const updated = { ...lichTrinhHienTai };
    updated.ngays = updated.ngays.filter((_, i) => i !== ngayIndex);
    updated.ngays = updated.ngays.map((n, i) => ({ ...n, ngay: i + 1 }));
    suaLichTrinh(updated.id, { ngays: updated.ngays });
    setLichTrinhHienTai({ ...updated });
  };

  const chiPhi = lichTrinhHienTai ? tinhChiPhiLichTrinh(lichTrinhHienTai) : null;

  const getDiemDenInfo = (diemDenId: string) => diemDens.find((d) => d.id === diemDenId);

  return (
    <div className='lich-trinh-page'>
      <Row gutter={[16, 16]}>
        {/* Danh sách lịch trình */}
        <Col xs={24} md={6}>
          <Card
            title={<><CalendarOutlined /> Lịch trình của tôi</>}
            extra={
              <Button type='primary' size='small' icon={<PlusOutlined />} onClick={() => setVisibleNew(true)}>
                Tạo mới
              </Button>
            }
            className='sidebar-card'
          >
            {lichTrinhs.length === 0 ? (
              <Empty description='Chưa có lịch trình' />
            ) : (
              <List
                size='small'
                dataSource={lichTrinhs}
                renderItem={(lt) => (
                  <List.Item
                    className={`lt-item ${lichTrinhHienTai?.id === lt.id ? 'active' : ''}`}
                    onClick={() => setLichTrinhHienTai(lt)}
                    actions={[
                      <Popconfirm
                        key='del'
                        title='Xóa lịch trình này?'
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          xoaLichTrinh(lt.id);
                          if (lichTrinhHienTai?.id === lt.id) setLichTrinhHienTai(undefined);
                        }}
                      >
                        <Button size='small' danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={lt.ten}
                      description={`${lt.ngays?.length || 0} ngày • ${formatVND(lt.nganSachDuKien)}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Chi tiết lịch trình */}
        <Col xs={24} md={18}>
          {!lichTrinhHienTai ? (
            <Card>
              <Empty description='Chọn hoặc tạo mới lịch trình để bắt đầu' />
            </Card>
          ) : (
            <>
              {/* Thống kê chi phí */}
              <Card className='budget-summary-card' style={{ marginBottom: 16 }}>
                <Title level={4}>{lichTrinhHienTai.ten}</Title>
                <Row gutter={[16, 12]}>
                  <Col xs={12} sm={6}>
                    <div className='stat-item'>
                      <DollarOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                      <div>
                        <Text type='secondary'>Ngân sách</Text>
                        <div className='stat-value'>{formatVND(lichTrinhHienTai.nganSachDuKien)}</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className='stat-item'>
                      <DollarOutlined style={{ color: chiPhi?.vuotNganSach ? '#f5222d' : '#1890ff', fontSize: 20 }} />
                      <div>
                        <Text type='secondary'>Tổng chi</Text>
                        <div className='stat-value' style={{ color: chiPhi?.vuotNganSach ? '#f5222d' : undefined }}>
                          {formatVND(chiPhi?.tongChi || 0)}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className='stat-item'>
                      <ClockCircleOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                      <div>
                        <Text type='secondary'>Thời gian</Text>
                        <div className='stat-value'>{chiPhi?.tongThoiGian || 0}h</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className='stat-item'>
                      <CalendarOutlined style={{ color: '#fa8c16', fontSize: 20 }} />
                      <div>
                        <Text type='secondary'>Số ngày</Text>
                        <div className='stat-value'>{lichTrinhHienTai.ngays?.length || 0}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                {chiPhi?.vuotNganSach && (
                  <Alert
                    type='error'
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    message={`Vượt ngân sách ${formatVND(chiPhi.soTienVuot)}!`}
                    style={{ marginTop: 12 }}
                  />
                )}
              </Card>

              {/* Các ngày */}
              <Collapse defaultActiveKey={lichTrinhHienTai.ngays?.map((_, i) => i.toString())} className='days-collapse'>
                {lichTrinhHienTai.ngays?.map((ngay, ngayIndex) => (
                  <Panel
                    key={ngayIndex.toString()}
                    header={
                      <span>
                        <CalendarOutlined /> Ngày {ngay.ngay} — {ngay.diemDens.length} điểm đến
                      </span>
                    }
                    extra={
                      <Popconfirm title='Xóa ngày này?' onConfirm={() => handleRemoveDay(ngayIndex)}>
                        <Button size='small' danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                      </Popconfirm>
                    }
                  >
                    {/* Thêm điểm đến */}
                    <Select
                      placeholder='Thêm điểm đến...'
                      style={{ width: '100%', marginBottom: 12 }}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                      onSelect={(val: string) => handleAddDiemDen(ngayIndex, val)}
                      value={undefined}
                      options={diemDens.map((dd) => ({
                        value: dd.id,
                        label: `${dd.ten} (${dd.diaChi})`,
                      }))}
                    />

                    {/* Danh sách điểm đến trong ngày */}
                    {ngay.diemDens.length === 0 ? (
                      <Empty description='Chưa có điểm đến' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      <List
                        size='small'
                        dataSource={ngay.diemDens}
                        renderItem={(ddItem, itemIndex) => {
                          const info = getDiemDenInfo(ddItem.diemDenId);
                          if (!info) return null;
                          const cost = info.chiPhi.anUong + info.chiPhi.luuTru + info.chiPhi.diChuyen;
                          return (
                            <List.Item
                              className='dd-item'
                              actions={[
                                <Tooltip key='up' title='Lên'>
                                  <Button
                                    size='small'
                                    icon={<ArrowUpOutlined />}
                                    disabled={itemIndex === 0}
                                    onClick={() => handleReorder(ngayIndex, itemIndex, 'up')}
                                  />
                                </Tooltip>,
                                <Tooltip key='down' title='Xuống'>
                                  <Button
                                    size='small'
                                    icon={<ArrowDownOutlined />}
                                    disabled={itemIndex === ngay.diemDens.length - 1}
                                    onClick={() => handleReorder(ngayIndex, itemIndex, 'down')}
                                  />
                                </Tooltip>,
                                <Popconfirm
                                  key='del'
                                  title='Xóa điểm đến?'
                                  onConfirm={() => handleRemoveDiemDen(ngayIndex, ddItem.id)}
                                >
                                  <Button size='small' danger icon={<DeleteOutlined />} />
                                </Popconfirm>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Tag color='blue' style={{ margin: 0 }}>
                                    #{ddItem.thuTu}
                                  </Tag>
                                }
                                title={info.ten}
                                description={
                                  <span>
                                    <EnvironmentOutlined /> {info.diaChi} • 🕐 {info.thoiGianThamQuan}h • 💰{' '}
                                    {formatVND(cost)}
                                  </span>
                                }
                              />
                            </List.Item>
                          );
                        }}
                      />
                    )}
                  </Panel>
                ))}
              </Collapse>

              <Button
                type='dashed'
                icon={<PlusOutlined />}
                block
                style={{ marginTop: 12 }}
                onClick={handleAddDay}
              >
                Thêm ngày
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* Modal tạo lịch trình */}
      <Modal
        title='Tạo lịch trình mới'
        visible={visibleNew}
        onCancel={() => setVisibleNew(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={formNew} layout='vertical' onFinish={handleCreateLichTrinh}>
          <Form.Item name='ten' label='Tên lịch trình' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder='VD: Du lịch Đà Nẵng 3 ngày' />
          </Form.Item>
          <Form.Item name='soNgay' label='Số ngày' rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}>
            <InputNumber min={1} max={30} style={{ width: '100%' }} placeholder='Số ngày du lịch' />
          </Form.Item>
          <Form.Item
            name='nganSachDuKien'
            label='Ngân sách dự kiến (VNĐ)'
            rules={[{ required: true, message: 'Vui lòng nhập ngân sách' }]}
          >
            <InputNumber
              min={0}
              step={500000}
              style={{ width: '100%' }}
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => val?.replace(/,/g, '') as any}
              placeholder='VD: 10,000,000'
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Tạo lịch trình
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LichTrinh;
