import React, { useEffect } from 'react';
import { Modal, Table, Spin, Empty } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { ClubMember } from '@/models/cauLacBo';

interface MembersModalProps {
  visible: boolean;
  clubName: string;
  members: ClubMember[];
  onCancel: () => void;
  loading?: boolean;
}

const MembersModal: React.FC<MembersModalProps> = ({
  visible,
  clubName,
  members,
  onCancel,
  loading,
}) => {
  const columns: ColumnsType<ClubMember> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
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
  ];

  return (
    <Modal
      title={`Danh sách thành viên - ${clubName}`}
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <Spin spinning={loading}>
        {members.length === 0 ? (
          <Empty description="Chưa có thành viên nào" />
        ) : (
          <Table
            columns={columns}
            dataSource={members}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default MembersModal;
