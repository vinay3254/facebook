import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  getUserAPI, getUserPostsAPI, updateUserAPI,
  sendFriendRequestAPI, acceptFriendRequestAPI, declineFriendRequestAPI, unfriendAPI,
} from '../api';
import PostCard from '../components/post/PostCard';
import PostSkeleton from '../components/post/PostSkeleton';
import CreatePost from '../components/post/CreatePost';
import toast from 'react-hot-toast';
import {
  BriefcaseIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  EditIcon,
  HeartIcon,
  HomeIcon,
  MessageIcon,
  SparkIcon,
  UserPlusIcon,
  UsersIcon,
} from '../components/ui/Icons';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { sendSocketNotification } = useSocket();
  const isOwn = id === currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState('none');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const profilePicRef = useRef();
  const coverPhotoRef = useRef();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUserAPI(id);
      setProfile(data);
      setFriendStatus(data.friendshipStatus || 'none');
      setEditForm({
        name: data.name, bio: data.bio || '', hometown: data.hometown || '',
        workplace: data.workplace || '', relationshipStatus: data.relationshipStatus || '',
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    setPostsLoading(true);
    try {
      const { data } = await getUserPostsAPI(id, pageNum);
      if (append) setPosts(prev => [...prev, ...data.posts]);
      else setPosts(data.posts);
      setHasMore(data.hasMore);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
    fetchPosts(1);
  }, [fetchProfile, fetchPosts]);

  const handleFriendAction = async () => {
    try {
      if (friendStatus === 'none') {
        await sendFriendRequestAPI(id);
        setFriendStatus('pending_sent');
        sendSocketNotification(id, { type: 'friendRequest', sender: currentUser });
        toast.success('Friend request sent!');
      } else if (friendStatus === 'pending_received') {
        await acceptFriendRequestAPI(id);
        setFriendStatus('friends');
        sendSocketNotification(id, { type: 'friendAccepted', sender: currentUser });
        toast.success('Friend request accepted!');
      } else if (friendStatus === 'friends') {
        if (!window.confirm(`Unfriend ${profile?.name}?`)) return;
        await unfriendAPI(id);
        setFriendStatus('none');
        toast.success('Unfriended');
      } else if (friendStatus === 'pending_sent') {
        // Cancel request - for simplicity just show info
        toast('Friend request already sent');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => { if (v !== undefined) formData.append(k, v); });
      if (editForm._profilePicFile) formData.append('profilePicture', editForm._profilePicFile);
      if (editForm._coverPhotoFile) formData.append('coverPhoto', editForm._coverPhotoFile);

      const { data } = await updateUserAPI(id, formData);
      setProfile(data);
      updateUser(data);
      setShowEditModal(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setEditForm(prev => ({
      ...prev,
      [field === 'profilePicture' ? '_profilePicPreview' : '_coverPreview']: preview,
      [field === 'profilePicture' ? '_profilePicFile' : '_coverPhotoFile']: file,
    }));
  };

  if (loading) return (
    <div>
      <div className="skeleton" style={{ width: '100%', height: 350 }} />
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="skeleton" style={{ width: 168, height: 168, borderRadius: '50%', marginTop: '-84px' }} />
        <div className="skeleton" style={{ width: '30%', height: 28, marginTop: '12px' }} />
      </div>
    </div>
  );

  return (
    <div>
      {/* Cover Photo */}
      <div style={{ background: 'var(--white)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: 0 }}>
        {profile?.coverPhoto || editForm._coverPreview ? (
          <img
            src={editForm._coverPreview || profile.coverPhoto}
            alt="cover"
            className="profile-cover"
          />
        ) : (
          <div className="profile-cover-placeholder" />
        )}

        <div className="profile-info-section">
          <div className="profile-header-row">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div className="profile-avatar-wrap">
                {profile?.profilePicture || editForm._profilePicPreview ? (
                  <img
                    src={editForm._profilePicPreview || profile.profilePicture}
                    alt={profile?.name}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {profile?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ paddingBottom: '12px' }}>
                <h1 className="profile-name">{profile?.name}</h1>
                <p style={{ color: 'var(--secondary-text)', fontSize: '16px' }}>
                  {profile?.friends?.length || 0} friends
                </p>
              </div>
            </div>

            <div className="profile-actions">
              {isOwn ? (
                <button className="btn-ghost" onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <EditIcon size={16} />
                  <span>Edit profile</span>
                </button>
              ) : (
                <>
                  {friendStatus === 'friends' ? (
                    <button className="btn-ghost" onClick={handleFriendAction} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UsersIcon size={16} />
                      <span>Connected</span>
                    </button>
                  ) : friendStatus === 'pending_sent' ? (
                    <button className="btn-ghost" disabled style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ClockIcon size={16} />
                      <span>Pending</span>
                    </button>
                  ) : friendStatus === 'pending_received' ? (
                    <>
                      <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleFriendAction}>
                        <CheckIcon size={16} />
                        <span>Accept</span>
                      </button>
                      <button className="btn-ghost" onClick={async () => { await declineFriendRequestAPI(id); setFriendStatus('none'); }}>Decline</button>
                    </>
                  ) : (
                    <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleFriendAction}>
                      <UserPlusIcon size={16} />
                      <span>Add friend</span>
                    </button>
                  )}
                  <Link to="/messenger">
                    <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageIcon size={16} />
                      <span>Message</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {profile?.bio && <p className="profile-bio" style={{ marginTop: '8px' }}>{profile.bio}</p>}

          <div style={{ marginTop: '8px' }}>
            {profile?.hometown && <div className="profile-info-detail"><HomeIcon size={16} /> Lives in <strong>{profile.hometown}</strong></div>}
            {profile?.workplace && <div className="profile-info-detail"><BriefcaseIcon size={16} /> Works at <strong>{profile.workplace}</strong></div>}
            {profile?.relationshipStatus && <div className="profile-info-detail"><HeartIcon size={16} /> {profile.relationshipStatus}</div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {['posts', 'about', 'friends'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '14px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 700, color: activeTab === tab ? 'var(--primary)' : 'var(--secondary-text)',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                textTransform: 'capitalize',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '16px' }}>
        {/* Left Panel */}
        <div>
          {/* About Card */}
          <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Intro</h3>
            {profile?.bio && <p style={{ textAlign: 'center', marginBottom: '12px', fontSize: '15px' }}>{profile.bio}</p>}
            {profile?.hometown && <div className="profile-info-detail"><HomeIcon size={16} /> Lives in <strong>{profile.hometown}</strong></div>}
            {profile?.workplace && <div className="profile-info-detail"><BriefcaseIcon size={16} /> Works at <strong>{profile.workplace}</strong></div>}
            {profile?.relationshipStatus && <div className="profile-info-detail"><HeartIcon size={16} /> {profile.relationshipStatus}</div>}
            {isOwn && (
              <button className="btn-ghost" style={{ width: '100%', marginTop: '12px' }} onClick={() => setShowEditModal(true)}>
                Edit details
              </button>
            )}
          </div>

          {/* Friends Card */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Friends</h3>
                <p style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>{profile?.friends?.length || 0} friends</p>
              </div>
              <Link to="/friends" style={{ color: 'var(--primary)', fontSize: '15px', fontWeight: 600 }}>See all</Link>
            </div>
            <div className="profile-friends-grid">
              {(profile?.friends || []).slice(0, 9).map(friend => (
                <Link key={friend._id || friend} to={`/profile/${friend._id || friend}`} className="profile-friend-item">
                  {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt={friend.name} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: 1, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#090B0B', fontWeight: 700, fontSize: '24px' }}>
                      {friend.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>{typeof friend === 'object' ? friend.name : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          {isOwn && <CreatePost onPostCreated={post => setPosts(prev => [post, ...prev])} />}
          {postsLoading ? (
            <><PostSkeleton /><PostSkeleton /></>
          ) : posts.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon"><SparkIcon size={24} /></div>
              <h3>No posts yet</h3>
              <p>When new updates land on this profile, they will appear here.</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={id => setPosts(prev => prev.filter(p => p._id !== id))}
                  onUpdate={updated => setPosts(prev => prev.map(p => p._id === updated._id ? updated : p))}
                />
              ))}
              {hasMore && (
                <button className="btn-ghost" style={{ width: '100%', marginTop: '8px' }} onClick={() => { const next = page + 1; setPage(next); fetchPosts(next, true); }}>
                  Load more posts
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div style={{ width: 36 }} />
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)} type="button">
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="modal-body">
              {/* Profile Picture */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {editForm._profilePicPreview || profile?.profilePicture ? (
                    <img src={editForm._profilePicPreview || profile.profilePicture} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: 100, height: 100, fontSize: 36 }}>{profile?.name?.[0]}</div>
                  )}
                  <button
                    onClick={() => profilePicRef.current?.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: '#090B0B', cursor: 'pointer', fontSize: '16px' }}
                    type="button"
                  >
                    <CameraIcon size={14} strokeWidth={2.2} />
                  </button>
                </div>
                <input ref={profilePicRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileChange('profilePicture', e.target.files[0])} />
                <p style={{ fontSize: '13px', color: 'var(--secondary-text)', marginTop: '4px' }}>Profile Picture</p>
              </div>

              {/* Cover Photo */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 700, fontSize: '15px', display: 'block', marginBottom: '8px' }}>Cover Photo</label>
                <div
                  onClick={() => coverPhotoRef.current?.click()}
                  style={{ width: '100%', height: 120, background: editForm._coverPreview || profile?.coverPhoto ? `url(${editForm._coverPreview || profile.coverPhoto}) center/cover` : 'linear-gradient(135deg,var(--primary),var(--primary-dark))', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {!editForm._coverPreview && !profile?.coverPhoto && <span style={{ color: 'white', fontWeight: 700 }}>Change cover photo</span>}
                </div>
                <input ref={coverPhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileChange('coverPhoto', e.target.files[0])} />
              </div>

              {[
                { key: 'name', label: 'Name', type: 'text', placeholder: 'Your full name' },
                { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Write a bio...' },
                { key: 'hometown', label: 'Hometown', type: 'text', placeholder: 'City, Country' },
                { key: 'workplace', label: 'Workplace', type: 'text', placeholder: 'Company name' },
              ].map(({ key, label, type, placeholder }) => (
                <div className="form-group" key={key}>
                  <label style={{ fontWeight: 600, fontSize: '15px', display: 'block', marginBottom: '4px' }}>{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      value={editForm[key] || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '15px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit', outline: 'none', background: 'var(--white)', color: 'var(--dark-text)' }}
                    />
                  ) : (
                    <input
                      type={type}
                      value={editForm[key] || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                    />
                  )}
                </div>
              ))}

              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '15px', display: 'block', marginBottom: '4px' }}>Relationship Status</label>
                <select
                  value={editForm.relationshipStatus || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, relationshipStatus: e.target.value }))}
                >
                  <option value="">-- Select --</option>
                  {['Single', 'In a relationship', 'Engaged', 'Married', "It's complicated", 'Divorced', 'Widowed'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button className="btn-primary" onClick={handleSaveProfile} disabled={editLoading} style={{ marginTop: '8px' }}>
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
