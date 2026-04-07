import { useEffect, useState } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, InputNumber, Select, Rate,
  Popconfirm, message, Space, Tag, Image, Upload, Row, Col, Typography,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import './style.less';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const LOAI_MAP: Record<string, { label: string; color: string }> = {
  bien: { label: 'Biển', color: 'blue' },
  nui: { label: 'Núi', color: 'green' },
  thanhpho: { label: 'Thành phố', color: 'orange' },
};

const QuanLyDiemDen: React.FC = () => {
  const {
    diemDens, getDiemDens, themDiemDen, suaDiemDen, xoaDiemDen, loading,
    visibleForm, setVisibleForm, isEdit, setIsEdit, diemDenEdit, setDiemDenEdit,
  } = useModel('dulich');

  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [hinhAnhUrl, setHinhAnhUrl] = useState('');

  useEffect(() => {
    getDiemDens();
  }, []);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setDiemDenEdit(undefined);
    setHinhAnhUrl('');
    form.resetFields();
    setVisibleForm(true);
  };

  const handleOpenEdit = (record: DuLich.DiemDen) => {
    setIsEdit(true);
    setDiemDenEdit(record);
    setHinhAnhUrl(record.hinhAnh);
    form.setFieldsValue({
      ...record,
      chiPhiAnUong: record.chiPhi.anUong,
      chiPhiLuuTru: record.chiPhi.luuTru,
      chiPhiDiChuyen: record.chiPhi.diChuyen,
    });
    setVisibleForm(true);
  };

  const handleSubmit = (values: any) => {
    const data: any = {
      ten: values.ten,
      moTa: values.moTa,
      hinhAnh: values.hinhAnh || hinhAnhUrl || 'https://via.placeholder.com/400x250',
      loai: values.loai,
      danhGia: values.danhGia || 4,
      thoiGianThamQuan: values.thoiGianThamQuan,
      chiPhi: {
        anUong: values.chiPhiAnUong || 0,
        luuTru: values.chiPhiLuuTru || 0,
        diChuyen: values.chiPhiDiChuyen || 0,
      },
      diaChi: values.diaChi,
    };

    if (isEdit && diemDenEdit) {
      suaDiemDen(diemDenEdit.id, data);
      message.success('Cập nhật điểm đến thành công!');
    } else {
      themDiemDen(data);
      message.success('Thêm điểm đến thành công!');
    }
    setVisibleForm(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    xoaDiemDen(id);
    message.success('Xóa điểm đến thành công!');
  };

  const filteredData = search
    ? diemDens.filter(
        (d) =>
          d.ten.toLowerCase().includes(search.toLowerCase()) ||
          d.diaChi.toLowerCase().includes(search.toLowerCase()),
      )
    : diemDens;

  const formatVND = (val: number) => val?.toLocaleString('vi-VN') + 'đ';

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          width={80}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 6 }}
          fallback='https://via.placeholder.com/80x60'
        />
      ),
    },
    {
      title: 'Tên điểm đến',
      dataIndex: 'ten',
      key: 'ten',
      sorter: (a: DuLich.DiemDen, b: DuLich.DiemDen) => a.ten.localeCompare(b.ten),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      responsive: ['md'] as any,
    },
    {
      title: 'Loại',
      dataIndex: 'loai',
      key: 'loai',
      render: (loai: string) => (
        <Tag color={LOAI_MAP[loai]?.color}>{LOAI_MAP[loai]?.label}</Tag>
      ),
      filters: [
        { text: 'Biển', value: 'bien' },
        { text: 'Núi', value: 'nui' },
        { text: 'Thành phố', value: 'thanhpho' },
      ],
      onFilter: (value: any, record: DuLich.DiemDen) => record.loai === value,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'danhGia',
      key: 'danhGia',
      width: 160,
      sorter: (a: DuLich.DiemDen, b: DuLich.DiemDen) => a.danhGia - b.danhGia,
      render: (val: number) => <Rate disabled value={val} allowHalf style={{ fontSize: 14 }} />,
    },
    {
      title: 'Thời gian (h)',
      dataIndex: 'thoiGianThamQuan',
      key: 'thoiGianThamQuan',
      width: 100,
      responsive: ['lg'] as any,
      sorter: (a: DuLich.DiemDen, b: DuLich.DiemDen) => a.thoiGianThamQuan - b.thoiGianThamQuan,
    },
    {
      title: 'Tổng chi phí',
      key: 'tongChiPhi',
      width: 140,
      responsive: ['md'] as any,
      render: (_: any, record: DuLich.DiemDen) => {
        const total = record.chiPhi.anUong + record.chiPhi.luuTru + record.chiPhi.diChuyen;
        return <span style={{ fontWeight: 600, color: '#f5222d' }}>{formatVND(total)}</span>;
      },
      sorter: (a: DuLich.DiemDen, b: DuLich.DiemDen) =>
        a.chiPhi.anUong + a.chiPhi.luuTru + a.chiPhi.diChuyen -
        (b.chiPhi.anUong + b.chiPhi.luuTru + b.chiPhi.diChuyen),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: DuLich.DiemDen) => (
        <Space>
          <Button size='small' type='primary' icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm title='Xóa điểm đến này?' onConfirm={() => handleDelete(record.id)}>
            <Button size='small' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='quan-ly-diem-den-page'>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>🗺️ Quản lý điểm đến</Title>}
        extra={
          <Space>
            <Input
              placeholder='Tìm kiếm...'
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ width: 200 }}
            />
            <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
              Thêm mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey='id'
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Tổng ${t} điểm đến` }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Form Modal */}
      <Modal
        title={isEdit ? '✏️ Sửa điểm đến' : '➕ Thêm điểm đến mới'}
        visible={visibleForm}
        onCancel={() => { setVisibleForm(false); form.resetFields(); }}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name='ten' label='Tên điểm đến' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder='VD: Vịnh Hạ Long' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name='diaChi' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                <Input placeholder='VD: Quảng Ninh' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='moTa' label='Mô tả'>
            <TextArea rows={3} placeholder='Mô tả về điểm đến...' />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name='loai' label='Loại hình' rules={[{ required: true, message: 'Chọn loại hình' }]}>
                <Select placeholder='Chọn loại'>
                  <Option value='bien'>🏖️ Biển</Option>
                  <Option value='nui'>⛰️ Núi</Option>
                  <Option value='thanhpho'>🏙️ Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name='danhGia' label='Đánh giá' rules={[{ required: true, message: 'Chọn đánh giá' }]}>
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name='thoiGianThamQuan' label='Thời gian (giờ)' rules={[{ required: true, message: 'Nhập thời gian' }]}>
                <InputNumber min={1} max={48} style={{ width: '100%' }} placeholder='VD: 8' />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Chi phí (VNĐ/ngày)</Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name='chiPhiAnUong' label='Ăn uống' rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber
                  min={0}
                  step={50000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(val) => val?.replace(/,/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name='chiPhiLuuTru' label='Lưu trú' rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber
                  min={0}
                  step={50000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(val) => val?.replace(/,/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name='chiPhiDiChuyen' label='Di chuyển' rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber
                  min={0}
                  step={50000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(val) => val?.replace(/,/g, '') as any}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='hinhAnh' label='URL hình ảnh'>
            <Input
              placeholder='https://example.com/image.jpg'
              onChange={(e) => setHinhAnhUrl(e.target.value)}
            />
          </Form.Item>

          {hinhAnhUrl && (
            <div style={{ marginBottom: 16 }}>
              <Image
                src={hinhAnhUrl}
                width={200}
                height={130}
                style={{ objectFit: 'cover', borderRadius: 8 }}
                fallback='https://via.placeholder.com/200x130'
              />
            </div>
          )}

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit'>
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => { setVisibleForm(false); form.resetFields(); }}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDiemDen;
