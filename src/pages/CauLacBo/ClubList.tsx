import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Input,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import ClubModal from './components/ClubModal';
import MembersModal from './components/MembersModal';
import type { Club, CauLacBoState, ClubMember } from '@/models/cauLacBo';

interface ClubListPageProps {
  cauLacBo?: CauLacBoState;
  dispatch?: any;
}

const ClubListPage: React.FC<ClubListPageProps> = ({ cauLacBo = {}, dispatch }: any) => {
  const [visible, setVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | undefined>();
  const [searchText, setSearchText] = useState('');
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [selectedClubForMembers, setSelectedClubForMembers] = useState<Club | undefined>();
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const { clubs = [], loading = false, members = [] } = cauLacBo;

  useEffect(() => {
    console.log('🔍 ClubList - useEffect triggered, calling getClubs');
    dispatch?.({ type: 'cauLacBo/getClubs' });
  }, [dispatch]);

  const handleAddClub = () => {
    setEditingClub(undefined);
    setVisible(true);
  };

  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setVisible(true);
  };

  const handleDeleteClub = (id: string) => {
    dispatch?.({
      type: 'cauLacBo/deleteClub',
      payload: id,
    });
    message.success('Xóa câu lạc bộ thành công');
  };

  const handleSubmitClub = (data: any) => {
    if (editingClub) {
      dispatch?.({
        type: 'cauLacBo/updateClub',
        payload: {
          id: editingClub.id,
          updates: data,
        },
      });
      message.success('Cập nhật câu lạc bộ thành công');
    } else {
      dispatch?.({
        type: 'cauLacBo/createClub',
        payload: data,
      });
      message.success('Thêm câu lạc bộ thành công');
    }
    setVisible(false);
  };

  const handleViewMembers = (club: Club) => {
    setSelectedClubForMembers(club);
    setMembersLoading(true);
    const filteredMembers = members.filter((m) => m.clubId === club.id);
    setClubMembers(filteredMembers);
    setMembersLoading(false);
    setMemberModalVisible(true);
  };

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchText.toLowerCase()) ||
      club.leader.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Club> = [
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => handleViewMembers(record)}
          >
            Thành viên
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClub(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteClub(record.id)}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClub}>
          Thêm mới
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc chủ nhiệm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {clubs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Chưa có câu lạc bộ nào. Hãy thêm mới!</p>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredClubs}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <ClubModal
        visible={visible}
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ mới'}
        initialData={editingClub}
        onSubmit={handleSubmitClub}
        onCancel={() => setVisible(false)}
        loading={loading}
      />

      {selectedClubForMembers && (
        <MembersModal
          visible={memberModalVisible}
          clubName={selectedClubForMembers.name}
          members={clubMembers}
          onCancel={() => setMemberModalVisible(false)}
          loading={membersLoading}
        />
      )}
    </Card>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(ClubListPage);
