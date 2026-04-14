import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Input, Select, Tag } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import ChangeClubModal from './components/ChangeClubModal';
import type { ClubMember, CauLacBoState, Club } from '@/models/cauLacBo';

interface MemberPageProps {
  cauLacBo: CauLacBoState;
  dispatch: any;
}

const MemberPage: React.FC<MemberPageProps> = ({ cauLacBo, dispatch }) => {
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [changeClubVisible, setChangeClubVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { members = [], clubs = [], loading = false } = cauLacBo || {};

  useEffect(() => {
    dispatch({ type: 'cauLacBo/getClubs' });
    dispatch({ type: 'cauLacBo/getApplications' });
  }, []);

  useEffect(() => {
    if (clubs.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0].id);
      dispatch({ type: 'cauLacBo/getMembersByClub', payload: clubs[0].id });
    }
  }, [clubs]);

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedMemberIds([]);
    dispatch({ type: 'cauLacBo/getMembersByClub', payload: clubId });
  };

  const handleChangeClub = () => {
    if (selectedMemberIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    setChangeClubVisible(true);
  };

  const handleChangeClubSubmit = (newClubId: string) => {
    dispatch({
      type: 'cauLacBo/changeClubForMembers',
      payload: { memberIds: selectedMemberIds, newClubId },
    });
    message.success(`Chuyển ${selectedMemberIds.length} thành viên sang CLB mới thành công`);
    setChangeClubVisible(false);
    setSelectedMemberIds([]);
    // Reload members for current club
    setTimeout(() => {
      dispatch({ type: 'cauLacBo/getMembersByClub', payload: selectedClubId });
    }, 100);
  };

  const currentClubName = clubs.find((c: Club) => c.id === selectedClubId)?.name || '';

  const filteredMembers = members.filter(
    (member: ClubMember) =>
      member.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone.includes(searchText),
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
      width: 90,
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
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
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
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ marginRight: 8 }}>Câu lạc bộ:</span>
            <Select
              placeholder="Chọn câu lạc bộ"
              style={{ width: 220 }}
              value={selectedClubId || undefined}
              onChange={handleClubChange}
            >
              {clubs.map((club: Club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Input.Search
            placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 350 }}
          />
        </div>

        {selectedMemberIds.length > 0 && (
          <Button type="primary" icon={<SwapOutlined />} onClick={handleChangeClub}>
            Chuyển CLB cho {selectedMemberIds.length} thành viên đã chọn
          </Button>
        )}

        {currentClubName && (
          <div>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              {currentClubName} - {filteredMembers.length} thành viên
            </Tag>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredMembers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} thành viên` }}
          rowSelection={rowSelection}
        />
      </Space>

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

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(MemberPage);
