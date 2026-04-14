import React, { useMemo, useState } from 'react';
import { Card, Table, Button, Space, Input, Select, message, Popconfirm, Tag, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CourseModal from './components/CourseModal';
import type { Course, CourseStatus } from './typing';
import { instructors, statusOptions } from './typing';

const initialCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Lập trình JavaScript cơ bản',
    instructor: 'Thiên Lý',
    studentCount: 18,
    status: 'Đang mở',
    description: '<p>Khóa học giới thiệu JavaScript và lập trình web cơ bản.</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-2',
    name: 'Thiết kế Web với HTML/CSS',
    instructor: 'Hải Âu',
    studentCount: 24,
    status: 'Đang mở',
    description: '<p>Học cách xây dựng giao diện responsive và thân thiện với người dùng.</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-3',
    name: 'Quản lý dự án Agile',
    instructor: 'Mộc Nhi',
    studentCount: 0,
    status: 'Tạm dừng',
    description: '<p>Khóa học thực hành quản lý dự án theo phương pháp Agile.</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const KhoaHocPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Course | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [filterInstructor, setFilterInstructor] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<CourseStatus | undefined>(undefined);
  const [modalLoading, setModalLoading] = useState(false);

  const headerStyle = {
    background: 'linear-gradient(135deg, #ff5ec9 0%, #ffb347 40%, #7d5bff 100%)',
    borderRadius: 20,
    color: '#fff',
    padding: 28,
    boxShadow: '0 24px 40px rgba(0,0,0,0.18)',
    marginBottom: 24,
  } as const;

  const filterBoxStyle = {
    background: 'rgba(255, 255, 255, 0.16)',
    border: '1px solid rgba(255,255,255,0.34)',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
  } as const;

  const buttonStyle = {
    background: 'linear-gradient(90deg, #ff5ec9, #7d5bff)',
    borderColor: 'transparent',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(125, 91, 255, 0.35)',
  } as const;

  const rowClassName = (record: Course) => {
    if (record.status === 'Đã kết thúc') return 'course-row-finished';
    if (record.status === 'Tạm dừng') return 'course-row-paused';
    return 'course-row-open';
  };

  const handleOpenAdd = () => {
    setEditingItem(undefined);
    setVisible(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingItem(course);
    setVisible(true);
  };

  const handleSubmit = async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!data.name?.trim()) {
      return message.error('Tên khóa học không được để trống');
    }

    const duplicate = courses.find(
      (course) => course.name.trim().toLowerCase() === data.name.trim().toLowerCase() && course.id !== editingItem?.id,
    );
    if (duplicate) {
      return message.error('Tên khóa học đã tồn tại, vui lòng chọn tên khác');
    }

    setModalLoading(true);
    if (editingItem) {
      const updated: Course = {
        ...editingItem,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setCourses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      message.success('Cập nhật khóa học thành công');
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCourses((prev) => [newCourse, ...prev]);
      message.success('Thêm mới khóa học thành công');
    }
    setModalLoading(false);
    setVisible(false);
  };

  const handleDelete = (course: Course) => {
    if (course.studentCount > 0) {
      return message.warning('Chỉ được xóa khóa học chưa có học viên');
    }
    setCourses((prev) => prev.filter((item) => item.id !== course.id));
    message.success('Xóa khóa học thành công');
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) =>
        course.name.toLowerCase().includes(searchText.trim().toLowerCase()),
      )
      .filter((course) => (filterInstructor ? course.instructor === filterInstructor : true))
      .filter((course) => (filterStatus ? course.status === filterStatus : true));
  }, [courses, searchText, filterInstructor, filterStatus]);

  const columns = [
    {
      title: 'ID khóa học',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Course, b: Course) => a.name.localeCompare(b.name),
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      filters: instructors.map((name) => ({ text: name, value: name })),
      onFilter: (value: string, record: Course) => record.instructor === value,
    },
    {
      title: 'Số học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
      render: (value: number) => <span>{value}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map((status) => ({ text: status, value: status })),
      onFilter: (value: string, record: Course) => record.status === value,
      render: (status: CourseStatus) => {
        const color = status === 'Đang mở' ? 'green' : status === 'Đã kết thúc' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 210,
      render: (_: any, record: Course) => (
        <Space>
          <Button type="default" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa khóa học"
            description="Chỉ được xóa khi khóa học chưa có học viên. Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: '#150f24' }}>
      <style>{`
        .course-row-open td {
          background: rgba(128, 223, 255, 0.08);
        }
        .course-row-paused td {
          background: rgba(255, 170, 0, 0.12);
        }
        .course-row-finished td {
          background: rgba(127, 100, 255, 0.12);
        }
        .course-modal-wrapper .ant-modal-content {
          border-radius: 24px;
          background: linear-gradient(180deg, #fff7f3 0%, #fff0ff 100%);
          box-shadow: 0 30px 80px rgba(125, 91, 255, 0.22);
        }
        .course-modal-wrapper .ant-modal-header {
          background: linear-gradient(90deg, #ff5ec9, #7d5bff);
          border-radius: 24px 24px 0 0;
          color: white;
        }
      `}</style>
      <div style={headerStyle}>
        <Typography.Title style={{ color: '#fff', marginBottom: 8, fontSize: 38 }} level={2}>
          KHÓA HỌC ONLINE SIÊU NHỒNG
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#ffe3ff', fontSize: 16, marginBottom: 0 }}>
          Giao diện bắt mắt, lọc dễ, tìm nhanh, thêm xóa chỉnh sửa cực kỳ sôi động. Thêm khóa học, chọn giảng viên và quản lý trạng thái ngay.
        </Typography.Paragraph>
      </div>
      <Card
        bodyStyle={{ background: 'linear-gradient(180deg, #211538 0%, #36124f 100%)', borderRadius: 24 }}
        style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
      >
        <div style={filterBoxStyle}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8}>
              <Input.Search
                allowClear
                placeholder="Tìm kiếm theo tên khóa học"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: 14 }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                placeholder="Lọc giảng viên"
                style={{ width: '100%', borderRadius: 14 }}
                value={filterInstructor}
                onChange={(value) => setFilterInstructor(value)}
                dropdownStyle={{ borderRadius: 16 }}
              >
                {instructors.map((name) => (
                  <Select.Option key={name} value={name}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                placeholder="Lọc trạng thái"
                style={{ width: '100%', borderRadius: 14 }}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                dropdownStyle={{ borderRadius: 16 }}
              >
                {statusOptions.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={4} style={{ textAlign: 'right' }}>
              <Button style={buttonStyle} icon={<PlusOutlined />} onClick={handleOpenAdd}>
                Thêm mới
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          rowClassName={rowClassName}
          style={{ marginTop: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 20, overflow: 'hidden' }}
          bordered={false}
        />
      </Card>

      <CourseModal
        visible={visible}
        title={editingItem ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        initialData={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => setVisible(false)}
        submitLoading={modalLoading}
      />
    </div>
  );
};

export default KhoaHocPage;
