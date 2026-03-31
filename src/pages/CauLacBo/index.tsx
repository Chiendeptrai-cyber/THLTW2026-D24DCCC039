import React from 'react';
import ClubListPage from './ClubList';

const CauLacBoPage: React.FC = () => {
  console.log('🔍 CauLacBoPage - rendering without tabs');

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Câu lạc bộ</h1>
      <ClubListPage />
    </div>
  );
};

export default CauLacBoPage;
