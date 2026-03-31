import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Tag,
  Input,
  Select,
} from 'antd';
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
import type { RegistrationApplication, CauLacBoState } from '@/models/cauLacBo';

interface RegistrationPageProps {
  cauLacBo?: CauLacBoState;
  dispatch?: any;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ cauLacBo = {}, dispatch }) => {
  const [visible, setVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<RegistrationApplication | undefined>();
  const [approveRejectVisible, setApproveRejectVisible] = useState(false);
  const [approveRejectAction, setApproveRejectAction] = useState<'approve' | 'reject'>('approve');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedHistories, setSelectedHistories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { applications = [], clubs = [], loading = false } = cauLacBo;

  useEffect(() => {
    dispatch?.({ type: 'cauLacBo/getApplications' });
    dispatch?.({ type: 'cauLacBo/getClubs' });
  }, [dispatch]);

  const handleAddApplication = () => {
    setEditingApp(undefined);
    setVisible(true);
  };

  const handleEditApplication = (app: RegistrationApplication) => {
    setEditingApp(app);
    setVisible(true);
  };

  const handleViewDetail = (app: RegistrationApplication) => {
    setEditingApp(app);
    setVisible(true);
  };

  const handleDeleteApplication = (id: string) => {
    dispatch?.({
      type: 'cauLacBo/deleteApplication',
      payload: id,
    });
    message.success('Xóa đơn đăng ký thành công');
  };

  const handleSubmitApplication = (data: any) => {
    if (editingApp) {
      dispatch?.({
        type: 'cauLacBo/updateApplication',
        payload: {
          id: editingApp.id,
          updates: data,
        },
      });
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      dispatch?.({
        type: 'cauLacBo/createApplication',
        payload: {
          ...data,
          status: 'Pending',
          actionHistories: [],
        },
      });
      message.success('Thêm đơn đăng ký thành công');
    }
    setVisible(false);
  };

  const handleApproveReject = (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    setApproveRejectAction(action);
    setApproveRejectVisible(true);
  };

  const handleApproveRejectSubmit = (reason?: string) => {
    if (approveRejectAction === 'approve') {
      dispatch?.({
        type: 'cauLacBo/batchApproveApplications',
        payload: {
          ids: selectedIds,
          adminName: 'Admin',
        },
      });
      message.success('Duyệt đơn thành công');
    } else {
      if (!reason) {
        message.error('Vui lòng nhập lý do từ chối');
        return;
      }
      dispatch?.({
        type: 'cauLacBo/batchRejectApplications',
        payload: {
          ids: selectedIds,
          reason,
          adminName: 'Admin',
        },
      });
      message.success('Từ chối đơn thành công');
    }
    setApproveRejectVisible(false);
    setSelectedIds([]);
  };

  const handleViewHistory = (app: RegistrationApplication) => {
    setSelectedHistories(app.actionHistories || []);
    setHistoryVisible(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchSearch =
      app.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      app.email.toLowerCase().includes(searchText.toLowerCase()) ||
      app.phone.includes(searchText);
    const matchStatus = filterStatus ? app.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

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
    },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId) => {
        const club = clubs.find((c) => c.id === clubId);
        return club?.name || '-';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          Pending: 'orange',
          Approved: 'green',
          Rejected: 'red',
        };
        const labels = {
          Pending: 'Chờ duyệt',
          Approved: 'Đã duyệt',
          Rejected: 'Từ chối',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditApplication(record)}
          >
            Sửa
          </Button>
          {record.actionHistories && record.actionHistories.length > 0 && (
            <Button
              type="default"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleViewHistory(record)}
            >
              Lịch sử
            </Button>
          )}
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteApplication(record.id)}
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
    <Card title="Quản lý đơn đăng ký">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên, email hoặc SĐT"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            allowClear
            value={filterStatus || undefined}
            onChange={(val) => setFilterStatus(val || '')}
          >
            <Select.Option value="Pending">Chờ duyệt</Select.Option>
            <Select.Option value="Approved">Đã duyệt</Select.Option>
            <Select.Option value="Rejected">Từ chối</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddApplication}>
            Thêm mới
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApproveReject('approve')}
            >
              Duyệt {selectedIds.length} đơn
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleApproveReject('reject')}
            >
              Từ chối {selectedIds.length} đơn
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredApplications}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          rowSelection={rowSelection}
        />
      </Space>

      <ApplicationModal
        visible={visible}
        title={editingApp ? 'Chi tiết đơn đăng ký' : 'Thêm đơn đăng ký mới'}
        initialData={editingApp}
        clubs={clubs}
        onSubmit={handleSubmitApplication}
        onCancel={() => setVisible(false)}
        loading={loading}
      />

      <ApproveRejectModal
        visible={approveRejectVisible}
        action={approveRejectAction}
        ids={selectedIds}
        onSubmit={handleApproveRejectSubmit}
        onCancel={() => setApproveRejectVisible(false)}
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

export default connect(({ cauLacBo }) => ({ cauLacBo }))(RegistrationPage);
