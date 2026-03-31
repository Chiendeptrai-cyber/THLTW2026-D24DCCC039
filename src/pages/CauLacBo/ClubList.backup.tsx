// This is a backup of the simplified ClubList
// Kept for reference during debugging
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import type { CauLacBoState, Club } from '@/models/cauLacBo';

interface ClubListPageProps {
  cauLacBo?: CauLacBoState;
  dispatch?: any;
}

const ClubListPageBackup: React.FC<ClubListPageProps> = ({ cauLacBo = {}, dispatch }: any) => {
  const { clubs = [], loading = false } = cauLacBo;

  useEffect(() => {
    console.log('🔍 ClubList - Redux cauLacBo:', cauLacBo);
    console.log('🔍 ClubList - clubs data:', clubs);
    dispatch?.({ type: 'cauLacBo/getClubs' });
  }, []);

  return (
    <div>
      <h2>Danh sách Câu lạc bộ (Debug)</h2>
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}>
        <p><strong>Redux state:</strong> {JSON.stringify(cauLacBo)}</p>
        <p><strong>Clubs count:</strong> {clubs.length}</p>
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        {clubs.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h3>Clubs loaded:</h3>
            <ul>
              {clubs.map((club: Club) => (
                <li key={club.id}>{club.name} - Led by {club.leader}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ cauLacBo }: any) => ({ cauLacBo }))(ClubListPageBackup);
