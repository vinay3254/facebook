import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../App.css';

const Layout = ({ children, noPadding, fullWidth }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className={`main-content ${noPadding ? 'no-padding' : ''}`}>
        {noPadding ? (
          children
        ) : fullWidth ? (
          <div style={{ padding: '16px' }}>{children}</div>
        ) : (
          <div className="content-wrapper">
            <Sidebar side="left" />
            <main className="content-main">{children}</main>
            <Sidebar side="right" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
