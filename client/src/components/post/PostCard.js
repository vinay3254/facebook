import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { likePostAPI, addCommentAPI, deletePostAPI, deleteCommentAPI, updatePostAPI } from '../../api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  CommentIcon,
  EditIcon,
  GlobeIcon,
  LikeIcon,
  LockIcon,
  MoreIcon,
  ShareIcon,
  TrashIcon,
  UsersIcon,
} from '../ui/Icons';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [imageOpen, setImageOpen] = useState(false);
  const menuRef = useRef(null);

  const isLiked = likes.some(id => id === user?._id || id?._id === user?._id);
  const isOwner = post.author?._id === user?._id || post.author === user?._id;
  const PrivacyIcon = post.privacy === 'public' ? GlobeIcon : post.privacy === 'friends' ? UsersIcon : LockIcon;

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLike = async () => {
    // Optimistic update
    const wasLiked = isLiked;
    setLikes(prev => wasLiked
      ? prev.filter(id => (id?._id || id) !== user._id)
      : [...prev, user._id]
    );
    try {
      await likePostAPI(post._id);
    } catch {
      setLikes(post.likes);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const text = commentText;
    setCommentText('');
    try {
      const { data } = await addCommentAPI(post._id, text);
      setComments(prev => [...prev, data]);
    } catch {
      toast.error('Failed to add comment');
      setCommentText(text);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
    try {
      await deleteCommentAPI(post._id, commentId);
    } catch {
      toast.error('Failed to delete comment');
      setComments(comments);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePostAPI(post._id);
      onDelete?.(post._id);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await updatePostAPI(post._id, { content: editContent });
      onUpdate?.(data);
      setEditing(false);
      toast.success('Post updated');
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/profile/${post.author?._id}`);
    toast.success('Link copied!');
  };

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.author?._id}`}>
          {post.author?.profilePicture ? (
            <img src={post.author.profilePicture} alt={post.author.name} className="post-author-avatar" />
          ) : (
            <div className="avatar-placeholder" style={{ width: 40, height: 40 }}>
              {post.author?.name?.[0]?.toUpperCase()}
            </div>
          )}
        </Link>

        <div className="post-author-info">
          <Link to={`/profile/${post.author?._id}`} className="post-author-name">
            {post.author?.name}
            {post.feeling?.label && <span style={{ fontWeight: 400 }}> is feeling {post.feeling.label}</span>}
          </Link>
          <div className="post-meta">
            <span>{timeAgo}</span>
            <span>·</span>
            <PrivacyIcon size={12} strokeWidth={2.2} />
          </div>
        </div>

        {isOwner && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button className="post-menu-btn" onClick={() => setShowMenu(p => !p)} type="button">
              <MoreIcon size={18} />
            </button>
            {showMenu && (
              <div className="dropdown" style={{ top: '40px', right: 0 }}>
                <button className="dropdown-item" onClick={() => { setEditing(true); setShowMenu(false); }}>
                  <EditIcon size={16} />
                  <span>Edit post</span>
                </button>
                <button className="dropdown-item" onClick={handleDelete} style={{ color: '#FA3E3E' }}>
                  <TrashIcon size={16} />
                  <span>Delete post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div style={{ padding: '0 16px 12px' }}>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            style={{
              width: '100%', minHeight: '80px', padding: '8px', border: '1px solid var(--border)',
              borderRadius: '8px', fontSize: '15px', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
              background: 'var(--bg)', color: 'var(--dark-text)',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: '15px' }} onClick={handleEdit}>Save</button>
            <button className="btn-ghost" onClick={() => { setEditing(false); setEditContent(post.content); }}>Cancel</button>
          </div>
        </div>
      ) : (
        post.content && (
          <div className="post-content" style={{ fontSize: post.content.length > 100 ? '15px' : '24px' }}>
            {post.content}
          </div>
        )
      )}

      {/* Image */}
      {post.image && (
        <>
          <img
            src={post.image}
            alt="post"
            className="post-image"
            onClick={() => setImageOpen(true)}
          />
          {imageOpen && (
            <div className="modal-overlay" onClick={() => setImageOpen(false)}>
              <img src={post.image} alt="full" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
            </div>
          )}
        </>
      )}

      {/* Video */}
      {post.video && (
        <video
          src={post.video}
          controls
          style={{ width: '100%', maxHeight: '500px', background: '#000', display: 'block' }}
        />
      )}

      {/* Stats */}
      {(likes.length > 0 || comments.length > 0) && (
        <div className="post-stats">
          <div className="like-count" onClick={() => likes.length && null}>
            {likes.length > 0 && (
              <>
                <span style={{ background: 'var(--primary)', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#090B0B' }}>
                  <LikeIcon size={11} strokeWidth={2.2} />
                </span>
                <span>{likes.length}</span>
              </>
            )}
          </div>
          <button
            onClick={() => setShowComments(p => !p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', fontSize: '15px' }}
          >
            {comments.length > 0 && `${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="post-actions-bar">
        <button className={`post-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          <LikeIcon size={18} />
          <span>Like</span>
        </button>
        <button className="post-action-btn" onClick={() => setShowComments(p => !p)}>
          <CommentIcon size={18} />
          <span>Comment</span>
        </button>
        <button className="post-action-btn" onClick={handleShare}>
          <ShareIcon size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <Link to={`/profile/${comment.author?._id}`}>
                {comment.author?.profilePicture ? (
                  <img src={comment.author.profilePicture} alt={comment.author.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 13 }}>
                    {comment.author?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
              <div style={{ flex: 1 }}>
                <div className="comment-bubble">
                  <div className="comment-author">{comment.author?.name}</div>
                  <div className="comment-text">{comment.content}</div>
                </div>
                <div className="comment-actions">
                  <span className="comment-action">Like</span>
                  <span className="comment-action">Reply</span>
                  {(comment.author?._id === user?._id || isOwner) && (
                    <span className="comment-action" onClick={() => handleDeleteComment(comment._id)} style={{ color: '#FA3E3E' }}>Delete</span>
                  )}
                  <span style={{ color: 'var(--secondary-text)' }}>
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <form onSubmit={handleComment} className="comment-input-row">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 13 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button type="submit" className="comment-submit" disabled={!commentText.trim()}>Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
