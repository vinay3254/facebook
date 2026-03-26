import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import {
  BellIcon,
  CompassIcon,
  HomeIcon,
  MessageIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UsersIcon,
  LogoutIcon,
} from '../ui/Icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      meta?.setAttribute('content', '#000000');
    } else {
      root.removeAttribute('data-theme');
      meta?.setAttribute('content', '#F7F2E8');
    }

    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const navLinks = [
    { to: '/', Icon: HomeIcon, label: 'Home' },
    { to: '/friends', Icon: UsersIcon, label: 'Friends' },
    { to: '/explore', Icon: CompassIcon, label: 'Explore' },
  ];

  return (
    <>
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">Facebook</Link>
        <form onSubmit={handleSearch} className="navbar-search">
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Center */}
      <div className="navbar-center">
        {navLinks.map(({ to, Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-icon-btn ${location.pathname === to ? 'active' : ''}`}
            title={label}
          >
            <Icon size={22} />
          </Link>
        ))}
        <Link
          to="/messenger"
          className={`nav-icon-btn ${location.pathname === '/messenger' ? 'active' : ''}`}
          title="Messenger"
        >
          <MessageIcon size={22} />
        </Link>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Dark Mode Toggle */}
        <button
          className="nav-icon-btn"
          onClick={() => setDarkMode(p => !p)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="nav-icon-btn"
            onClick={() => { setShowNotifications(p => !p); setShowProfileMenu(false); }}
            title="Notifications"
          >
            <BellIcon size={22} />
            {unreadCount > 0 && <span className="nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            className="nav-profile-btn"
            onClick={() => { setShowProfileMenu(p => !p); setShowNotifications(false); }}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
            )}
            <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          {showProfileMenu && (
            <div className="dropdown" style={{ top: '52px', right: 0, minWidth: '280px' }}>
              <Link to={`/profile/${user?._id}`} onClick={() => setShowProfileMenu(false)}>
                <div className="dropdown-item" style={{ padding: '12px 16px' }}>
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: '60px', height: '60px', fontSize: '24px' }}>{user?.name?.[0]?.toUpperCase()}</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '17px' }}>{user?.name}</div>
                    <div style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>See your profile</div>
                  </div>
                </div>
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => { logout(); setShowProfileMenu(false); }}>
                <LogoutIcon size={18} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation */}
    <nav className="mobile-nav">
      <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <HomeIcon size={22} />
        <span>Home</span>
      </Link>
      <Link to="/friends" className={`mobile-nav-item ${location.pathname === '/friends' ? 'active' : ''}`}>
        <UsersIcon size={22} />
        <span>Friends</span>
      </Link>
      <Link to="/messenger" className={`mobile-nav-item ${location.pathname === '/messenger' ? 'active' : ''}`}>
        <MessageIcon size={22} />
        <span>Chats</span>
      </Link>
      <Link to="/explore" className={`mobile-nav-item ${location.pathname === '/explore' ? 'active' : ''}`}>
        <CompassIcon size={22} />
        <span>Explore</span>
      </Link>
      <Link to="/notifications" className={`mobile-nav-item ${location.pathname === '/notifications' ? 'active' : ''}`} style={{ position: 'relative' }}>
        <BellIcon size={22} />
        {unreadCount > 0 && <span className="mobile-nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        <span>Alerts</span>
      </Link>
    </nav>
    </>
  );
};

export default Navbar;
