import React from 'react';

const PostSkeleton = () => (
  <div className="skeleton-post">
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: '6px' }} />
        <div className="skeleton" style={{ width: '20%', height: 12 }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: '100%', height: 16, marginBottom: '8px' }} />
    <div className="skeleton" style={{ width: '80%', height: 16, marginBottom: '8px' }} />
    <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: '8px', marginBottom: '12px' }} />
    <div style={{ display: 'flex', gap: '8px' }}>
      <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: '8px' }} />
      <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: '8px' }} />
      <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: '8px' }} />
    </div>
  </div>
);

export default PostSkeleton;
