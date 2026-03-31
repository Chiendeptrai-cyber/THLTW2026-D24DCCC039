import React from 'react';

const SimpleTest: React.FC = () => {
  console.log('✅ SimpleTest component rendering!');
  
  return (
    <div style={{ padding: '20px', background: '#e8f5e9', border: '2px solid green' }}>
      <h2>✅ SimpleTest Component</h2>
      <p>This is a simple test component WITHOUT Redux.</p>
      <p style={{ color: 'green', fontWeight: 'bold' }}>If you see this = tabs are working!</p>
    </div>
  );
};

export default SimpleTest;
