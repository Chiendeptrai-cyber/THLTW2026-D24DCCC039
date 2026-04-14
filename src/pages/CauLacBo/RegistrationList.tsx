import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Popconfirm, Tag, Input, Select, Descriptions, Modal } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import ApplicationModal from './components/ApplicationModal';
import ApproveRejectModal from './components/ApproveRejectModal';
import HistoryModal from './components/HistoryModal';
import type { RegistrationApplication, CauLacBoState, Club } from '@/models/cauLacBo';

interface RegistrationPageProps {
  cauLacBo: CauLacBoState;
  dispatch: any;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ cauLacBo, dispatch }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<RegistrationApplication | undefined>();
  const [viewingApp, setViewingApp] = useState<RegistrationApplication | undefined>();
  const [approveRejectVisible, setApproveRejectVisible] = useState(false);
  const [approveRejectAction, setApproveRejectAction] = useState<'approve' | 'reject'>('approve');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedHistories, setSelectedHistories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { applications = [], clubs = [], loading = false } = cauLacBo || {};

  useEffect(() => {
    dispatch({ type: 'cauLacBo/getApplications' });
    dispatch({ type: 'cauLacBo/getClubs' });
  }, []);

  const handleAdd = () => {
    setEditingApp(undefined);
    setFormVisible(true);
  };

  const handleEdit = (app: RegistrationApplication) => {
    setEditingApp(app);
    setFormVisible(true);
  };

  const handleViewDetail = (app: RegistrationApplication) => {
    setViewingApp(app);
    setDetailVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'cauLacBo/deleteApplication', payload: id });
    message.success('Xóa đơn đăng ký thành công');
  };

  const handleSubmit = (data: any) => {
    if (editingApp) {
      dispatch({ type: 'cauLacBo/updateApplication', payload: { id: editingApp.id, updates: data } });
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      dispatch({ type: 'cauLacBo/createApplication', payload: data });
      message.success('Thêm đơn đăng ký thành công');
    }
    setFormVisible(false);
    setEditingApp(undefined);
  };

  const handleBatchAction = (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    setApproveRejectAction(action);
    setApproveRejectVisible(true);
  };

  const handleApproveRejectSubmit = (reason?: string) => {
    if (approveRejectAction === 'approve') {
      dispatch({ type: 'cauLacBo/batchApprove', payload: { ids: selectedIds, adminName: 'Admin' } });
      message.success(`Duyệt ${selectedIds.length} đơn thành công`);
    } else {
      if (!reason) {
        message.error('Vui lòng nhập lý do từ chối');
        return;
      }
      dispatch({ type: 'cauLacBo/batchReject', payload: { ids: selectedIds, reason, adminName: 'Admin' } });
      message.success(`Từ chối ${selectedIds.length} đơn thành công`);
    }
    setApproveRejectVisible(false);
    setSelectedIds([]);
  };

  const handleSingleApprove = (id: string) => {
    setSelectedIds([id]);
    setApproveRejectAction('approve');
    setApproveRejectVisible(true);
  };

  const handleSingleReject = (id: string) => {
    setSelectedIds([id]);
    setApproveRejectAction('reject');
    setApproveRejectVisible(true);
  };

  const handleViewHistory = (app: RegistrationApplication) => {
    setSelectedHistories(app.actionHistories || []);
    setHistoryVisible(true);
  };

  const getClubName = (clubId: string) => {
    const club = clubs.find((c: Club) => c.id === clubId);
    return club?.name || '-';
  };

  const filteredApplications = applications.filter((app: RegistrationApplication) => {
    const matchSearch =
      app.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      app.email.toLowerCase().includes(searchText.toLowerCase()) ||
      app.phone.includes(searchText);
    const matchStatus = filterStatus ? app.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<string, { color: string; label: string }> = {
    Pending: { color: 'orange', label: 'Chờ duyệt' },
    Approved: { color: 'green', label: 'Đã duyệt' },
    Rejected: { color: 'red', label: 'Từ chối' },
  };

  const columns: ColumnsType<RegistrationApplication> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 90,
      filters: [
        { text: 'Nam', value: 'Nam' },
        { text: 'Nữ', value: 'Nữ' },
      ],
      onFilter: (value: any, record) => record.gender === value,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => getClubName(clubId),
      filters: clubs.map((c: Club) => ({ text: c.name, value: c.id })),
      onFilter: (value: any, record) => record.clubId === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const config = statusConfig[status];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 360,
      render: (_: any, record: RegistrationApplication) => (
        <Space size="small" wrap>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleSingleApprove(record.id)} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                Duyệt
              </Button>
              <Button type="primary" danger size="small" icon={<CloseOutlined />} onClick={() => handleSingleReject(record.id)}>
                Từ chối
              </Button>
            </>
          )}
          {record.actionHistories && record.actionHistories.length > 0 && (
            <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewHistory(record)}>
              Lịch sử
            </Button>
          )}
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa đơn đăng ký này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedIds(newSelectedKeys as string[]);
    },
  };

  return (
    <Card title="Quản lý đơn đăng ký thành viên">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 350 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 180 }}
            allowClear
            value={filterStatus || undefined}
            onChange={(val) => setFilterStatus(val || '')}
          >
            <Select.Option value="Pending">Chờ duyệt</Select.Option>
            <Select.Option value="Approved">Đã duyệt</Select.Option>
            <Select.Option value="Rejected">Từ chối</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <Space>
            <Button type="primary" icon={<CheckOutlined />} onClick={() => handleBatchAction('approve')} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
              Duyệt {selectedIds.length} đơn đã chọn
            </Button>
            <Button type="primary" danger icon={<CloseOutlined />} onClick={() => handleBatchAction('reject')}>
              Không duyệt {selectedIds.length} đơn đã chọn
            </Button>
          </Space>
        )}

        <Table
          columns={columns}
          dataSource={filteredApplications}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} đơn` }}
          rowSelection={rowSelection}
        />
      </Space>

      <ApplicationModal
        visible={formVisible}
        title={editingApp ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
        initialData={editingApp}
        clubs={clubs}
        onSubmit={handleSubmit}
        onCancel={() => {
          setFormVisible(false);
          setEditingApp(undefined);
        }}
        loading={loading}
      />

      <Modal
        title="Chi tiết đơn đăng ký"
        visible={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setViewingApp(undefined);
        }}
        footer={null}
        width={700}
      >
        {viewingApp && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Họ tên" span={2}>{viewingApp.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewingApp.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{viewingApp.phone}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{viewingApp.gender}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{viewingApp.address}</Descriptions.Item>
            <Descriptions.Item label="Sở trường" span={2}>{viewingApp.specialty}</Descriptions.Item>
            <Descriptions.Item label="Câu lạc bộ">{getClubName(viewingApp.clubId)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[viewingApp.status]?.color}>
                {statusConfig[viewingApp.status]?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do đăng ký" span={2}>{viewingApp.registrationReason}</Descriptions.Item>
            {viewingApp.rejectionReason && (
              <Descriptions.Item label="Lý do từ chối" span={2}>
                <span style={{ color: '#f5222d' }}>{viewingApp.rejectionReason}</span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ngày đăng ký">{moment(viewingApp.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">{moment(viewingApp.updatedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <ApproveRejectModal
        visible={approveRejectVisible}
        action={approveRejectAction}
        count={selectedIds.length}
        onSubmit={handleApproveRejectSubmit}
        onCancel={() => {
          setApproveRejectVisible(false);
          setSelectedIds([]);
        }}
        loading={loading}
      />

      <HistoryModal
        visible={historyVisible}
        histories={selectedHistories}
        onCancel={() => setHistoryVisible(false)}
      />
    </Card>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(RegistrationPage);
