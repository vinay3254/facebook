import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchUsersAPI, sendFriendRequestAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { SearchIcon } from '../components/ui/Icons';

const Search = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    if (q.trim()) {
      doSearch(q);
    } else {
      setResults([]);
    }
  }, [q]);

  const doSearch = async (query) => {
    setLoading(true);
    try {
      const { data } = await searchUsersAPI(query);
      setResults(data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await sendFriendRequestAPI(userId);
      setSentRequests(prev => new Set([...prev, userId]));
      toast.success('Friend request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const isFriend = (userId) => {
    return (user.friends || []).some(f => (f._id || f) === userId);
  };

  return (
    <div>
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
          {q ? `Search results for "${q}"` : 'Search for people'}
        </h2>
        {!q && (
          <p style={{ color: 'var(--secondary-text)', fontSize: '14px', marginTop: '4px' }}>
            Use the search bar in the navbar to find people
          </p>
        )}
      </div>

      <div className="card">
        {loading ? (
          Array(4).fill(null).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '40%', height: 16, marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '25%', height: 13 }} />
              </div>
              <div className="skeleton" style={{ width: 120, height: 36, borderRadius: '6px' }} />
            </div>
          ))
        ) : results.length === 0 && q ? (
          <div className="empty-state">
            <div className="empty-state-icon"><SearchIcon size={24} /></div>
            <h3>No results for "{q}"</h3>
            <p>Try a different name or check the spelling.</p>
          </div>
        ) : (
          results.map(person => (
            <div
              key={person._id}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Link to={`/profile/${person._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, textDecoration: 'none', color: 'inherit' }}>
                {person.profilePicture ? (
                  <img
                    src={person.profilePicture}
                    alt={person.name}
                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 60, height: 60, fontSize: 22, flexShrink: 0 }}>
                    {person.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--dark-text)' }}>{person.name}</div>
                  {person.mutualFriends > 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--secondary-text)', marginTop: '2px' }}>
                      {person.mutualFriends} mutual friend{person.mutualFriends !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>

              <div>
                {isFriend(person._id) ? (
                  <button className="btn-ghost" disabled>
                    Connected
                  </button>
                ) : sentRequests.has(person._id) ? (
                  <button className="btn-ghost" disabled>
                    Pending
                  </button>
                ) : (
                  <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }} onClick={() => handleAddFriend(person._id)}>
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
