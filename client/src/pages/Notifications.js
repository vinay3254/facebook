import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotificationsAPI, markNotificationReadAPI, markAllNotificationsReadAPI } from '../api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { BellIcon, CheckIcon, CommentIcon, LikeIcon, ShareIcon, UsersIcon } from '../components/ui/Icons';

const typeIcons = {
  like: { Icon: LikeIcon, bg: 'var(--primary)' },
  comment: { Icon: CommentIcon, bg: 'var(--primary)' },
  friendRequest: { Icon: UsersIcon, bg: 'var(--primary)' },
  friendAccepted: { Icon: CheckIcon, bg: 'var(--primary-dark)' },
  share: { Icon: ShareIcon, bg: 'var(--primary)' },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotificationsAPI();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadAPI(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadAPI();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Notifications</h2>
            {unreadCount > 0 && <p style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={handleMarkAllRead}>Mark all as read</button>
          )}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '16px' }}>
            {Array(5).fill(null).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '80%', height: 15, marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '30%', height: 12 }} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><BellIcon size={24} /></div>
            <h3>No notifications</h3>
            <p>When people interact with your posts or profile, updates will appear here.</p>
          </div>
        ) : (
          notifications.map(notif => {
            const meta = typeIcons[notif.type] || { Icon: BellIcon, bg: 'var(--primary)' };
            const link = notif.postId
              ? `/profile/${notif.sender?._id}`
              : `/profile/${notif.sender?._id}`;
            return (
              <Link
                key={notif._id}
                to={link}
                className={`notification-item ${notif.read ? '' : 'unread'}`}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}
                onClick={() => !notif.read && handleMarkRead(notif._id)}
              >
                <div className="notification-avatar" style={{ position: 'relative', flexShrink: 0 }}>
                  {notif.sender?.profilePicture ? (
                    <img src={notif.sender.profilePicture} alt={notif.sender.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: 20 }}>
                    {notif.sender?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--white)', color: 'white' }}>
                    <meta.Icon size={12} strokeWidth={2.2} />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="notification-text">
                    <strong>{notif.sender?.name}</strong>{' '}
                    {notif.message || `${notif.type} interaction`}
                  </p>
                  <p style={{ fontSize: '13px', color: notif.read ? 'var(--secondary-text)' : 'var(--primary)', marginTop: '4px', fontWeight: notif.read ? 400 : 700 }}>
                    {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : ''}
                  </p>
                </div>

                {!notif.read && <div className="unread-dot" />}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
