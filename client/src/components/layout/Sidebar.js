import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BellIcon, HomeIcon, MessageIcon, UsersIcon } from '../ui/Icons';

const Sidebar = ({ side = 'left' }) => {
  const { user } = useAuth();
  const location = useLocation();
  const year = new Date().getFullYear();

  if (side === 'left') {
    return (
      <div className="sidebar">
        <Link to={`/profile/${user?._id}`} className="sidebar-item">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
          )}
          <span style={{ fontWeight: 600 }}>{user?.name}</span>
        </Link>

        <Link to="/" className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
          <div className="sidebar-icon"><HomeIcon size={18} /></div>
          <span>Feed</span>
        </Link>

        <Link to="/friends" className={`sidebar-item ${location.pathname === '/friends' ? 'active' : ''}`}>
          <div className="sidebar-icon"><UsersIcon size={18} /></div>
          <span>Friends</span>
        </Link>

        <Link to="/messenger" className={`sidebar-item ${location.pathname === '/messenger' ? 'active' : ''}`}>
          <div className="sidebar-icon"><MessageIcon size={18} /></div>
          <span>Messenger</span>
        </Link>

        <Link to="/notifications" className={`sidebar-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
          <div className="sidebar-icon"><BellIcon size={18} /></div>
          <span>Notifications</span>
        </Link>

        <div className="sidebar-divider" />
        <div className="sidebar-section-title">Shortcuts</div>

        {user?.friends?.slice(0, 6).map(friend => (
          <Link key={friend._id || friend} to={`/profile/${friend._id || friend}`} className="sidebar-item">
            <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14 }}>
              {typeof friend === 'object' ? friend.name?.[0]?.toUpperCase() : '?'}
            </div>
            <span>{typeof friend === 'object' ? friend.name : 'Friend'}</span>
          </Link>
        ))}
        <div style={{ padding: '8px 8px', fontSize: '13px', color: 'var(--secondary-text)', marginTop: '8px' }}>
          Reunion © {year}
        </div>
      </div>
    );
  }

  // Right sidebar
  return (
    <div className="sidebar">
      <div className="sidebar-section-title" style={{ marginBottom: '8px' }}>Contacts</div>
      {user?.friends?.slice(0, 10).map(friend => (
        <Link
          key={friend._id || friend}
          to={`/messenger`}
          className="sidebar-item"
        >
          <div style={{ position: 'relative' }}>
            {typeof friend === 'object' && friend.profilePicture ? (
              <img src={friend.profilePicture} alt={friend.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14 }}>
                {typeof friend === 'object' ? friend.name?.[0]?.toUpperCase() : '?'}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--white)' }} />
          </div>
          <span>{typeof friend === 'object' ? friend.name : 'Friend'}</span>
        </Link>
      ))}
      {(!user?.friends || user.friends.length === 0) && (
        <p style={{ fontSize: '14px', color: 'var(--secondary-text)', padding: '8px' }}>
          Add friends to start chatting
        </p>
      )}
    </div>
  );
};

export default Sidebar;
