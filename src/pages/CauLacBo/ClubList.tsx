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
    console.log('🔍 ClubList - Redux cauLacBo:', cauLacBo);
    console.log('🔍 ClubList - clubs data:', clubs);
    console.log('🔍 ClubList - dispatch available:', !!dispatch);
    console.log('🔍 ClubList - calling getClubs effect');
    dispatch?.({ type: 'cauLacBo/getClubs' });
  }, []);

  return (
    <div>
      <h1>Test - Danh sách câu lạc bộ</h1>
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}>
        <p>Redux state: {JSON.stringify(cauLacBo)}</p>
        <p>Clubs count: {clubs.length}</p>
        <p>Loading: {loading ? 'true' : 'false'}</p>
      </div>
    </div>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(ClubListPage);
