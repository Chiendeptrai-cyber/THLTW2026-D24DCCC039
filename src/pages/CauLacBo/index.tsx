import React, { useEffect } from 'react';

const CauLacBoPage: React.FC = () => {
  useEffect(() => {
    console.log('🔍 CauLacBoPage - useEffect mount');
  }, []);

  console.log('🔍 CauLacBoPage - rendering');

  return (
    <div style={{ padding: '40px', background: '#fff', minHeight: '500px' }}>
      <h1 style={{ color: '#ff0000', fontSize: '32px' }}>
        ✅ CLUB MANAGEMENT SYSTEM ✅
      </h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        If you see this RED heading and this text, the component IS rendering!
      </p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#e8f5e9', border: '3px solid green' }}>
        <p style={{ fontSize: '16px', color: '#2e7d32' }}>
          ✅ Test UI is working!
        </p>
        <p>This proves the CauLacBo page component is rendering.</p>
      </div>
    </div>
  );
};

export default CauLacBoPage;
