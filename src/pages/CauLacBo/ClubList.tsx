import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Popconfirm, Input, Tag, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import ClubModal from './components/ClubModal';
import MembersModal from './components/MembersModal';
import type { Club, CauLacBoState, ClubMember } from '@/models/cauLacBo';

interface ClubListPageProps {
  cauLacBo: CauLacBoState;
  dispatch: any;
}

const ClubListPage: React.FC<ClubListPageProps> = ({ cauLacBo, dispatch }) => {
  const [visible, setVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | undefined>();
  const [searchText, setSearchText] = useState('');
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [selectedClubForMembers, setSelectedClubForMembers] = useState<Club | undefined>();

  const { clubs = [], members = [], loading = false } = cauLacBo || {};

  useEffect(() => {
    dispatch({ type: 'cauLacBo/getClubs' });
  }, []);

  const handleAdd = () => {
    setEditingClub(undefined);
    setVisible(true);
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'cauLacBo/deleteClub', payload: id });
    message.success('Xóa câu lạc bộ thành công');
  };

  const handleSubmit = (data: any) => {
    if (editingClub) {
      dispatch({ type: 'cauLacBo/updateClub', payload: { id: editingClub.id, updates: data } });
      message.success('Cập nhật câu lạc bộ thành công');
    } else {
      dispatch({ type: 'cauLacBo/createClub', payload: data });
      message.success('Thêm câu lạc bộ thành công');
    }
    setVisible(false);
    setEditingClub(undefined);
  };

  const handleViewMembers = (club: Club) => {
    setSelectedClubForMembers(club);
    dispatch({ type: 'cauLacBo/getMembersByClub', payload: club.id });
    setMemberModalVisible(true);
  };

  const filteredClubs = clubs.filter(
    (club: Club) =>
      club.name.toLowerCase().includes(searchText.toLowerCase()) ||
      club.leader.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Club> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: Club) => (
        <Avatar src={avatar} size={40}>
          {record.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: Club, b: Club) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (html: string) => (
        <Tooltip title={<div dangerouslySetInnerHTML={{ __html: html }} />}>
          <div dangerouslySetInnerHTML={{ __html: html }} style={{ maxHeight: 40, overflow: 'hidden' }} />
        </Tooltip>
      ),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'leader',
      key: 'leader',
      sorter: (a: Club, b: Club) => a.leader.localeCompare(b.leader),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: Club) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Có' : 'Không'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 280,
      render: (_: any, record: Club) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<TeamOutlined />} onClick={() => handleViewMembers(record)}>
            Thành viên
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa câu lạc bộ này?"
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

  return (
    <Card
      title="Quản lý câu lạc bộ"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên CLB hoặc chủ nhiệm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 350 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredClubs}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} CLB` }}
      />

      <ClubModal
        visible={visible}
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ mới'}
        initialData={editingClub}
        onSubmit={handleSubmit}
        onCancel={() => {
          setVisible(false);
          setEditingClub(undefined);
        }}
        loading={loading}
      />

      {selectedClubForMembers && (
        <MembersModal
          visible={memberModalVisible}
          clubName={selectedClubForMembers.name}
          members={members}
          onCancel={() => {
            setMemberModalVisible(false);
            setSelectedClubForMembers(undefined);
          }}
          loading={loading}
        />
      )}
    </Card>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(ClubListPage);
