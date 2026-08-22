import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPostAPI } from '../../api';
import toast from 'react-hot-toast';
import {
  CloseIcon,
  GlobeIcon,
  ImageIcon,
  LockIcon,
  SparkIcon,
  UsersIcon,
} from '../ui/Icons';

const FEELINGS = [
  { label: 'inspired', color: '#105666' },
  { label: 'grateful', color: '#839958' },
  { label: 'curious', color: '#D3968C' },
  { label: 'energized', color: '#105666' },
  { label: 'celebrating', color: '#839958' },
  { label: 'proud', color: '#0A3323' },
  { label: 'relaxed', color: '#839958' },
  { label: 'hopeful', color: '#105666' },
];

const privacyOptions = [
  { value: 'public', label: 'Public' },
  { value: 'friends', label: 'Friends' },
  { value: 'only me', label: 'Only me' },
];

const privacyMeta = {
  public: GlobeIcon,
  friends: UsersIcon,
  'only me': LockIcon,
};

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [privacy, setPrivacy] = useState('friends');
  const [feeling, setFeeling] = useState(null);
  const [showFeelings, setShowFeelings] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileIsVideo = file.type.startsWith('video/');
    const maxSize = fileIsVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(fileIsVideo ? 'Video must be under 100MB' : 'Image must be under 5MB');
      return;
    }
    setMedia(file);
    setIsVideo(fileIsVideo);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) { toast.error('Add some text, photo, or video'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      if (content) formData.append('content', content);
      if (media) formData.append('media', media);
      formData.append('privacy', privacy);
      if (feeling) {
        formData.append('feelingLabel', feeling.label);
      }

      const { data } = await createPostAPI(formData);
      onPostCreated?.(data);
      toast.success('Post created!');
      setShowModal(false);
      setContent('');
      setMedia(null);
      setMediaPreview('');
      setIsVideo(false);
      setFeeling(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setContent('');
    setMedia(null);
    setMediaPreview('');
    setIsVideo(false);
    setFeeling(null);
    setShowFeelings(false);
  };

  return (
    <>
      {/* Always-rendered hidden file input so programmatic .click() works from any user gesture */}
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleMediaSelect} />

      <div className="create-post-card">
        <div className="create-post-top">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
          )}
          <button className="create-post-input" onClick={() => setShowModal(true)}>
            What's on your mind, {user?.name?.split(' ')[0]}?
          </button>
        </div>
        <div className="create-post-divider" />
        <div className="create-post-actions">
          <button className="create-post-action-btn" onClick={() => { setShowModal(true); fileRef.current?.click(); }}>
            <ImageIcon size={18} /> Photo / Video
          </button>
          <button className="create-post-action-btn" onClick={() => { setShowModal(true); setShowFeelings(true); }}>
            <SparkIcon size={18} /> Mood / Activity
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal">
            <div className="modal-header">
              <div style={{ width: 36 }} />
              <h3>Create post</h3>
              <button className="modal-close" onClick={handleClose} type="button">
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div className="avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    {user?.name}
                    {feeling && <span style={{ fontWeight: 400 }}> is feeling {feeling.label}</span>}
                  </div>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginTop: '4px' }}>
                    {React.createElement(privacyMeta[privacy], { size: 14, style: { position: 'absolute', left: 8, color: 'var(--secondary-text)' } })}
                    <select
                      value={privacy}
                      onChange={e => setPrivacy(e.target.value)}
                      style={{ fontSize: '13px', padding: '4px 8px 4px 30px', borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--hover-bg)', cursor: 'pointer', color: 'var(--dark-text)' }}
                    >
                      {privacyOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <textarea
                className="post-textarea"
                placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
                value={content}
                onChange={e => setContent(e.target.value)}
                autoFocus
              />

              {mediaPreview && (
                <div style={{ position: 'relative', marginTop: '12px' }}>
                  {isVideo ? (
                    <video src={mediaPreview} controls style={{ width: '100%', borderRadius: '8px', maxHeight: '300px' }} />
                  ) : (
                    <img src={mediaPreview} alt="preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }} />
                  )}
                  <button onClick={() => { setMedia(null); setMediaPreview(''); setIsVideo(false); }} type="button" style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                    borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CloseIcon size={14} />
                  </button>
                </div>
              )}

              {showFeelings && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--secondary-text)' }}>What is the mood?</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {FEELINGS.map(f => (
                      <button
                        key={f.label}
                        onClick={() => { setFeeling(feeling?.label === f.label ? null : f); setShowFeelings(false); }}
                        type="button"
                        style={{
                          padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
                          background: feeling?.label === f.label ? 'var(--primary-light)' : 'var(--white)',
                          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <span style={{ width: 24, height: 24, borderRadius: '999px', background: f.color, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }} />
                        <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to post */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>Add to your post</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => fileRef.current?.click()} type="button" style={{ width: 36, height: 36, background: 'var(--bg)', border: 'none', borderRadius: '999px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-text)' }} title="Add photo">
                    <ImageIcon size={18} />
                  </button>
                  <button onClick={() => setShowFeelings(p => !p)} type="button" style={{ width: 36, height: 36, background: 'var(--bg)', border: 'none', borderRadius: '999px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-text)' }} title="Feeling or activity">
                    <SparkIcon size={18} />
                  </button>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && !media)}
                style={{ marginTop: '12px' }}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
