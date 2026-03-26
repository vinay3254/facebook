import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoriesAPI, createStoryAPI, viewStoryAPI } from '../../api';
import { CloseIcon, ImageIcon, PlusIcon } from '../ui/Icons';

const STORY_COLORS = ['#D4B571', '#C39A4E', '#8D6A29', '#6F5115', '#A88239', '#BFA169', '#8D733F'];

const StoryBar = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#D4B571');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const fetchStories = async () => {
    try {
      const res = await getStoriesAPI();
      setGroups(res.data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) {
      setError('Add an image or some text.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      if (text.trim()) formData.append('text', text.trim());
      formData.append('backgroundColor', bgColor);
      await createStoryAPI(formData);
      setShowCreate(false);
      setText('');
      setBgColor('#D4B571');
      setImageFile(null);
      setImagePreview('');
      fetchStories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post story.');
    } finally {
      setSubmitting(false);
    }
  };

  const openViewer = async (group, idx = 0) => {
    setViewingGroup(group);
    setViewingIndex(idx);
    try {
      await viewStoryAPI(group.stories[idx]._id);
    } catch {}
  };

  const closeViewer = () => {
    setViewingGroup(null);
    setViewingIndex(0);
  };

  const nextStory = async () => {
    if (!viewingGroup) return;
    if (viewingIndex < viewingGroup.stories.length - 1) {
      const next = viewingIndex + 1;
      setViewingIndex(next);
      try { await viewStoryAPI(viewingGroup.stories[next]._id); } catch {}
    } else {
      closeViewer();
    }
  };

  const prevStory = () => {
    if (!viewingGroup) return;
    if (viewingIndex > 0) setViewingIndex(viewingIndex - 1);
  };

  return (
    <>
      <div className="story-bar" style={{ marginBottom: '16px' }}>
        {/* Add Story card */}
        <div className="story-card add-story" onClick={() => setShowCreate(true)} style={{ cursor: 'pointer' }}>
          <div style={{
            width: '100%',
            flex: 1,
            background: user?.profilePicture ? `url(${user.profilePicture}) center/cover` : 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {!user?.profilePicture && (
              <div className="avatar-placeholder" style={{ width: 60, height: 60, fontSize: 24 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="add-btn">
            <PlusIcon size={18} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dark-text)', marginTop: '4px' }}>
            Create story
          </span>
        </div>

        {/* Real story groups */}
        {groups.map((group, gi) => {
          const latest = group.stories[0];
          return (
            <div
              key={group.author._id}
              className="story-card"
              onClick={() => openViewer(group)}
              style={{ cursor: 'pointer' }}
            >
              {latest.image ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `url(${latest.image}) center/cover`,
                  position: 'relative',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `url(${group.author.profilePicture || ''}) center/cover, var(--primary)`,
                    border: '3px solid var(--primary)',
                    position: 'absolute', top: 8, left: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '16px',
                  }}>
                    {!group.author.profilePicture && group.author.name?.[0]}
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: latest.backgroundColor || STORY_COLORS[gi % STORY_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '8px', position: 'relative',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `url(${group.author.profilePicture || ''}) center/cover, var(--primary)`,
                    border: '3px solid var(--primary)',
                    position: 'absolute', top: 8, left: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '14px',
                  }}>
                    {!group.author.profilePicture && group.author.name?.[0]}
                  </div>
                  {latest.text && (
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '13px', textAlign: 'center', marginTop: 32 }}>
                      {latest.text}
                    </span>
                  )}
                </div>
              )}
              <span className="story-name">{group.author.name}</span>
            </div>
          );
        })}
      </div>

      {/* Always-rendered hidden file input */}
      <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleImageChange} />

      {/* Create Story Modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--white, #fff)', borderRadius: '20px',
            padding: '24px', width: '380px', maxWidth: '92vw',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--dark-text)' }}>Create story</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--secondary-text)' }}>
                  Choose a photo or write a short update.
                </p>
              </div>
              <button
                onClick={() => { setShowCreate(false); setText(''); setImageFile(null); setImagePreview(''); setError(''); }}
                className="modal-close"
                type="button"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Image preview / picker */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%', height: '200px', borderRadius: '20px', cursor: 'pointer',
                background: imagePreview ? `url(${imagePreview}) center/cover` : (bgColor || 'var(--primary)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px', border: '1px solid rgba(255,255,255,0.18)',
                position: 'relative', overflow: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
              }}
            >
              {text && !imagePreview && (
                <span style={{ color: 'white', fontWeight: 700, fontSize: '18px', textAlign: 'center', padding: '8px' }}>
                  {text}
                </span>
              )}
              {!imagePreview && !text && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'white' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '999px', background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
                    <ImageIcon size={20} />
                  </div>
                  <span style={{ opacity: 0.84, fontSize: '13px' }}>Tap to add a photo</span>
                </div>
              )}
            </div>
            {/* Text input */}
            <textarea
              placeholder="Add text to your story..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={200}
              rows={2}
              style={{
                width: '100%', borderRadius: '12px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.04)', color: 'var(--dark-text)',
                padding: '8px 10px', fontSize: '14px', resize: 'none',
                boxSizing: 'border-box', marginBottom: '10px',
              }}
            />

            {/* Background color picker (text stories) */}
            {!imagePreview && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {['#D4B571', ...STORY_COLORS].map(c => (
                  <div
                    key={c}
                    onClick={() => setBgColor(c)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: bgColor === c ? '3px solid #000' : '3px solid transparent',
                    }}
                  />
                ))}
              </div>
            )}

            {error && <p style={{ color: 'red', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowCreate(false); setText(''); setImageFile(null); setImagePreview(''); setError(''); }}
                style={{
                  padding: '10px 16px', borderRadius: '999px', border: '1px solid var(--border)',
                  background: 'transparent', cursor: 'pointer', fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: 'auto',
                  padding: '10px 20px',
                  fontSize: '14px',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Posting...' : 'Share Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {viewingGroup && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ position: 'relative', width: '360px', maxWidth: '90vw', height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Story content */}
            {viewingGroup.stories[viewingIndex]?.image ? (
              <img
                src={viewingGroup.stories[viewingIndex].image}
                alt="story"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: viewingGroup.stories[viewingIndex]?.backgroundColor || 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '22px', textAlign: 'center', padding: '24px' }}>
                  {viewingGroup.stories[viewingIndex]?.text}
                </span>
              </div>
            )}

            {/* Author bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              padding: '12px', display: 'flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', border: '2px solid white',
                background: `url(${viewingGroup.author.profilePicture || ''}) center/cover, var(--primary)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, flexShrink: 0,
              }}>
                {!viewingGroup.author.profilePicture && viewingGroup.author.name?.[0]}
              </div>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                {viewingGroup.author.name}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginLeft: 'auto' }}>
                {viewingIndex + 1}/{viewingGroup.stories.length}
              </span>
            </div>

            {/* Navigation */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <div style={{ flex: 1, cursor: viewingIndex > 0 ? 'w-resize' : 'default' }} onClick={prevStory} />
              <div style={{ flex: 1, cursor: 'e-resize' }} onClick={nextStory} />
            </div>

            {/* Close */}
            <button
              onClick={closeViewer}
              style={{
                position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)',
                border: 'none', borderRadius: '50%', width: 32, height: 32,
                color: 'white', cursor: 'pointer', lineHeight: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryBar;
