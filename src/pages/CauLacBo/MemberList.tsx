import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Input,
  Select,
} from 'antd';
import {
  SwapOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import ChangeClubModal from '../components/ChangeClubModal';
import type { ClubMember, CauLacBoState, Club } from '@/models/cauLacBo';

interface MemberPageProps {
  cauLacBo?: CauLacBoState;
  dispatch?: any;
}

const MemberPage: React.FC<MemberPageProps> = ({ cauLacBo = {}, dispatch }) => {
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [changeClubVisible, setChangeClubVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { members = [], clubs = [], applications = [], loading = false } = cauLacBo;

  useEffect(() => {
    dispatch?.({ type: 'cauLacBo/getClubs' });
    dispatch?.({ type: 'cauLacBo/getApplications' });
  }, [dispatch]);

  useEffect(() => {
    if (clubs.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0].id);
      dispatch?.({
        type: 'cauLacBo/getMembersByClub',
        payload: clubs[0].id,
      });
    }
  }, [clubs, dispatch, selectedClubId]);

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedMemberIds([]);
    dispatch?.({
      type: 'cauLacBo/getMembersByClub',
      payload: clubId,
    });
  };

  const handleChangeClub = () => {
    if (selectedMemberIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    setChangeClubVisible(true);
  };

  const handleChangeClubSubmit = (newClubId: string) => {
    dispatch?.({
      type: 'cauLacBo/changeClubForMembers',
      payload: {
        memberIds: selectedMemberIds,
        newClubId,
      },
    });
    message.success(`Chuyển ${selectedMemberIds.length} thành viên thành công`);
    setChangeClubVisible(false);
    setSelectedMemberIds([]);
    // Reload members
    dispatch?.({
      type: 'cauLacBo/getMembersByClub',
      payload: selectedClubId,
    });
  };

  const filteredMembers = members.filter((member) =>
    member.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    member.email.toLowerCase().includes(searchText.toLowerCase()) ||
    member.phone.includes(searchText)
  );

  const columns: ColumnsType<ClubMember> = [
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
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sở trường',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Ngày gia nhập',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedMemberIds,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedMemberIds(newSelectedKeys as string[]);
    },
  };

  return (
    <Card title="Quản lý thành viên câu lạc bộ">
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Select
          placeholder="Chọn câu lạc bộ"
          style={{ width: 200 }}
          value={selectedClubId}
          onChange={handleClubChange}
        >
          {clubs.map((club) => (
            <Select.Option key={club.id} value={club.id}>
              {club.name}
            </Select.Option>
          ))}
        </Select>

        <Input.Search
          placeholder="Tìm kiếm theo tên, email hoặc SĐT"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        {selectedMemberIds.length > 0 && (
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={handleChangeClub}
          >
            Chuyển CLB ({selectedMemberIds.length})
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredMembers}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        rowSelection={rowSelection}
      />

      <ChangeClubModal
        visible={changeClubVisible}
        selectedCount={selectedMemberIds.length}
        clubs={clubs}
        currentClubId={selectedClubId}
        onSubmit={handleChangeClubSubmit}
        onCancel={() => setChangeClubVisible(false)}
        loading={loading}
      />
    </Card>
  );
};

export default connect(({ cauLacBo }) => ({ cauLacBo }))(MemberPage);
