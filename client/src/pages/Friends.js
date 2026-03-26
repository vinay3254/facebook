import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  getFriendRequestsAPI, getFriendSuggestionsAPI,
  acceptFriendRequestAPI, declineFriendRequestAPI, sendFriendRequestAPI, getUserFriendsAPI,
} from '../api';
import toast from 'react-hot-toast';
import { SearchIcon, SparkIcon, UsersIcon } from '../components/ui/Icons';

const FriendCard = ({ person, action, onAction, mutual }) => (
  <div className="friend-card">
    <Link to={`/profile/${person._id}`}>
      {person.profilePicture ? (
        <img src={person.profilePicture} alt={person.name} className="friend-card-img" />
      ) : (
        <div className="friend-card-img" style={{ background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#090B0B', fontWeight: 700 }}>
          {person.name?.[0]?.toUpperCase()}
        </div>
      )}
    </Link>
    <div className="friend-card-info">
      <div className="friend-card-name">{person.name}</div>
      {mutual !== undefined && (
        <div className="friend-card-mutual">{mutual} mutual friend{mutual !== 1 ? 's' : ''}</div>
      )}
      <div className="friend-card-actions">
        {action === 'request' && (
          <>
            <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '15px' }} onClick={() => onAction('accept', person._id)}>
              Confirm
            </button>
            <button className="btn-ghost" style={{ width: '100%', padding: '8px' }} onClick={() => onAction('decline', person._id)}>
              Delete
            </button>
          </>
        )}
        {action === 'suggestion' && (
          <>
            <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '15px' }} onClick={() => onAction('add', person._id)}>
              Add Friend
            </button>
            <button className="btn-ghost" style={{ width: '100%', padding: '8px' }} onClick={() => onAction('remove', person._id)}>
              Remove
            </button>
          </>
        )}
        {action === 'friend' && (
          <Link to={`/profile/${person._id}`}>
            <button className="btn-ghost" style={{ width: '100%', padding: '8px' }}>View Profile</button>
          </Link>
        )}
      </div>
    </div>
  </div>
);

const Friends = () => {
  const { user } = useAuth();
  const { sendSocketNotification } = useSocket();
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, sugRes, friendRes] = await Promise.all([
        getFriendRequestsAPI(),
        getFriendSuggestionsAPI(),
        getUserFriendsAPI(user._id),
      ]);
      setRequests(reqRes.data);
      setSuggestions(sugRes.data);
      setFriends(friendRes.data);
    } catch {
      toast.error('Failed to load friends data');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRequestAction = async (action, personId) => {
    try {
      if (action === 'accept') {
        await acceptFriendRequestAPI(personId);
        const accepted = requests.find(r => r.from._id === personId);
        if (accepted) {
          sendSocketNotification(personId, { type: 'friendAccepted', sender: user });
          setFriends(prev => [...prev, accepted.from]);
        }
        setRequests(prev => prev.filter(r => r.from._id !== personId));
        toast.success('Friend request accepted!');
      } else if (action === 'decline') {
        await declineFriendRequestAPI(personId);
        setRequests(prev => prev.filter(r => r.from._id !== personId));
        toast.success('Request declined');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleSuggestionAction = async (action, personId) => {
    try {
      if (action === 'add') {
        await sendFriendRequestAPI(personId);
        sendSocketNotification(personId, { type: 'friendRequest', sender: user });
        setSuggestions(prev => prev.filter(s => s._id !== personId));
        toast.success('Friend request sent!');
      } else {
        setSuggestions(prev => prev.filter(s => s._id !== personId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const tabs = [
    { key: 'requests', label: `Friend Requests${requests.length ? ` (${requests.length})` : ''}` },
    { key: 'suggestions', label: 'People You May Know' },
    { key: 'friends', label: 'All Friends' },
  ];

  return (
    <div>
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Friends</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '15px',
                background: activeTab === tab.key ? 'var(--primary-light)' : 'var(--hover-bg)',
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--dark-text)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="friends-grid">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="card" style={{ overflow: 'hidden' }}>
              <div className="skeleton" style={{ width: '100%', aspectRatio: 1 }} />
              <div style={{ padding: '8px 12px 12px' }}>
                <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '100%', height: 32, borderRadius: '6px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '100%', height: 32, borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'requests' && (
            <>
              {requests.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon"><UsersIcon size={24} /></div>
                  <h3>No pending requests</h3>
                  <p>New invitations will appear here as people reach out.</p>
                </div>
              ) : (
                <div className="friends-grid">
                  {requests.map(req => (
                    <FriendCard
                      key={req.from._id}
                      person={req.from}
                      action="request"
                      onAction={handleRequestAction}
                      mutual={req.from.friends?.filter(fId =>
                        (user.friends || []).some(myFId => (myFId._id || myFId) === (fId._id || fId))
                      ).length}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <>
              {suggestions.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon"><SearchIcon size={24} /></div>
                  <h3>No suggestions right now</h3>
                  <p>The recommendation list will refill as your network expands.</p>
                </div>
              ) : (
                <div className="friends-grid">
                  {suggestions.map(person => (
                    <FriendCard
                      key={person._id}
                      person={person}
                      action="suggestion"
                      onAction={handleSuggestionAction}
                      mutual={person.mutualFriends}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'friends' && (
            <>
              {friends.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon"><SparkIcon size={24} /></div>
                  <h3>Your network is still starting</h3>
                  <p>Add a few people to unlock a more active home feed and messenger list.</p>
                </div>
              ) : (
                <div className="friends-grid">
                  {friends.map(friend => (
                    <FriendCard
                      key={friend._id}
                      person={friend}
                      action="friend"
                      onAction={() => {}}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Friends;
