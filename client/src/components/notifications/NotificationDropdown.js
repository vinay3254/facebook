import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { getNotificationsAPI, markNotificationReadAPI, markAllNotificationsReadAPI } from '../../api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { BellIcon, CheckIcon, CommentIcon, LikeIcon, ShareIcon, UsersIcon } from '../ui/Icons';

const typeIcons = {
  like: { Icon: LikeIcon, bg: 'var(--primary)' },
  comment: { Icon: CommentIcon, bg: 'var(--primary)' },
  friendRequest: { Icon: UsersIcon, bg: 'var(--primary)' },
  friendAccepted: { Icon: CheckIcon, bg: 'var(--primary-dark)' },
  share: { Icon: ShareIcon, bg: 'var(--primary)' },
};

const NotificationDropdown = ({ onClose }) => {
  const { setNotifications } = useSocket();
  const [apiNotifications, setApiNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotificationsAPI();
      setApiNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notifId) => {
    try {
      await markNotificationReadAPI(notifId);
      setApiNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
      setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadAPI();
      setApiNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotifications([]);
    } catch {}
  };

  const allNotifs = [...apiNotifications];
  const unreadCount = allNotifs.filter(n => !n.read).length;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <span>Notifications</span>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        Array(4).fill(null).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px 16px' }}>
            <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '40%', height: 12 }} />
            </div>
          </div>
        ))
      ) : allNotifs.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--secondary-text)' }}>
          <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
            <BellIcon size={22} />
          </div>
          <p>No notifications yet</p>
        </div>
      ) : (
        allNotifs.map(notif => {
          const meta = typeIcons[notif.type] || { Icon: BellIcon, bg: 'var(--primary)' };
          const link = notif.postId
            ? `/profile/${notif.sender?._id}`
            : notif.type === 'friendRequest' || notif.type === 'friendAccepted'
            ? `/profile/${notif.sender?._id}`
            : '/';
          return (
            <Link
              to={link}
              key={notif._id}
              className={`notification-item ${notif.read ? '' : 'unread'}`}
              onClick={() => { handleMarkRead(notif._id); onClose(); }}
            >
              <div className="notification-avatar">
                {notif.sender?.profilePicture ? (
                  <img src={notif.sender.profilePicture} alt={notif.sender.name} />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: 20 }}>
                    {notif.sender?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="notification-icon" style={{ background: meta.bg }}>
                  <meta.Icon size={11} strokeWidth={2.2} />
                </div>
              </div>

              <div className="notification-text">
                <span><strong>{notif.sender?.name}</strong> {notif.message || getDefaultMessage(notif.type)}</span>
                <div className="notification-time">
                  {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : ''}
                </div>
              </div>

              {!notif.read && <div className="unread-dot" />}
            </Link>
          );
        })
      )}
    </div>
  );
};

const getDefaultMessage = (type) => {
  const msgs = {
    like: 'liked your post',
    comment: 'commented on your post',
    friendRequest: 'sent you a friend request',
    friendAccepted: 'accepted your friend request',
    share: 'shared your post',
  };
  return msgs[type] || 'sent you a notification';
};

export default NotificationDropdown;
