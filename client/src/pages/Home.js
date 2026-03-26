import React, { useState, useEffect, useCallback, useRef } from 'react';
import StoryBar from '../components/post/StoryBar';
import CreatePost from '../components/post/CreatePost';
import PostCard from '../components/post/PostCard';
import PostSkeleton from '../components/post/PostSkeleton';
import { getFeedAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ImageIcon,
  MessageIcon,
  RefreshIcon,
  SearchIcon,
  SparkIcon,
} from '../components/ui/Icons';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  const [sortMode, setSortMode] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const fetchFeed = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await getFeedAPI(pageNum);
      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFeed(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, page, fetchFeed]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    setPage(1);
    try {
      await fetchFeed(1);
    } finally {
      setRefreshing(false);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const mediaCount = posts.filter((post) => post.image || post.video).length;
  const discussedCount = posts.filter((post) => (post.comments?.length || 0) > 0).length;
  const activeFriends = user?.friends?.length || 0;

  let visiblePosts = [...posts].filter((post) => {
    const matchesFilter =
      feedFilter === 'all'
        ? true
        : feedFilter === 'media'
        ? Boolean(post.image || post.video)
        : (post.comments?.length || 0) > 0 || (post.likes?.length || 0) > 2;

    const authorName = post.author?.name?.toLowerCase() || '';
    const content = post.content?.toLowerCase() || '';
    const matchesSearch =
      !normalizedSearch ||
      authorName.includes(normalizedSearch) ||
      content.includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  visiblePosts.sort((a, b) => {
    if (sortMode === 'popular') {
      const scoreA = (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
      const scoreB = (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;
      if (scoreA !== scoreB) return scoreB - scoreA;
    }

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const highlightItems = [
    { label: 'Loaded', value: String(posts.length).padStart(2, '0') },
    { label: 'Media', value: String(mediaCount).padStart(2, '0') },
    { label: 'Discussed', value: String(discussedCount).padStart(2, '0') },
    { label: 'Friends', value: String(activeFriends).padStart(2, '0') },
  ];

  const filters = [
    { key: 'all', label: 'All posts', Icon: SparkIcon },
    { key: 'media', label: 'Media', Icon: ImageIcon },
    { key: 'discussed', label: 'Discussed', Icon: MessageIcon },
  ];

  return (
    <div className="page-stack">
      <section className="card feed-toolbar">
        <div className="feed-toolbar-head">
          <div className="feed-toolbar-copy">
            <span className="feed-toolbar-label">Home Feed</span>
            <h1>{user?.name?.split(' ')[0] || 'Your'} timeline</h1>
            <p>
              {visiblePosts.length} visible from {posts.length} loaded posts.
            </p>
          </div>
          <button
            className="btn-ghost feed-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            type="button"
          >
            <RefreshIcon size={16} />
            <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>

        <div className="feed-highlights">
          {highlightItems.map((item) => (
            <div key={item.label} className="feed-highlight">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="feed-controls">
          <div className="feed-filter-strip">
            {filters.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                className={`feed-filter-btn ${feedFilter === key ? 'active' : ''}`}
                onClick={() => setFeedFilter(key)}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="feed-tools">
            <label className="feed-search-field">
              <SearchIcon size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search this feed"
              />
            </label>

            <select
              className="feed-sort-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>
      </section>

      <StoryBar />
      <CreatePost onPostCreated={handlePostCreated} />

      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : posts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><SparkIcon size={24} /></div>
          <h3>No posts yet</h3>
          <p>Create a post or add a few more friends to bring your feed to life.</p>
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><SearchIcon size={24} /></div>
          <h3>No posts match this view</h3>
          <p>Clear the search or switch filters to see more from the posts already loaded.</p>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setSearchTerm('');
              setFeedFilter('all');
              setSortMode('latest');
            }}
          >
            Reset view
          </button>
        </div>
      ) : (
        <>
          {visiblePosts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDeleted}
              onUpdate={handlePostUpdated}
            />
          ))}
          <div ref={sentinelRef} style={{ height: 1 }} />
          {loadingMore && <PostSkeleton />}
          {!hasMore && posts.length > 0 && (
            <div className="feed-end-note">
              You've seen all posts
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
