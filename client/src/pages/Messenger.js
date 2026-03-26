import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  getConversationsAPI, getOrCreateConversationAPI,
  getMessagesAPI, sendMessageAPI, getUserFriendsAPI,
} from '../api';
import toast from 'react-hot-toast';
import { EditIcon, MessageIcon, SearchIcon, SendIcon } from '../components/ui/Icons';

const Messenger = () => {
  const { user } = useAuth();
  const { incomingMessage, setIncomingMessage, sendSocketMessage, isUserOnline, emitTyping, emitStopTyping } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const isTyping = false;
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle incoming real-time messages
  useEffect(() => {
    if (!incomingMessage || !activeConv) return;
    const otherUser = activeConv.participants?.find(p => p._id !== user._id);
    if (incomingMessage.senderId === otherUser?._id) {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        sender: { _id: incomingMessage.senderId },
        content: incomingMessage.message,
        createdAt: new Date(),
      }]);
      setIncomingMessage(null);
    }
  }, [incomingMessage, activeConv, user._id, setIncomingMessage]);

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await getConversationsAPI();
      setConversations(data);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      const { data } = await getUserFriendsAPI(user._id);
      setFriends(data);
    } catch {}
  }, [user._id]);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, [fetchConversations, fetchFriends]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setMessagesLoading(true);
    try {
      const { data } = await getMessagesAPI(conv._id);
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
    inputRef.current?.focus();
  };

  const startConversationWithFriend = async (friendId) => {
    try {
      const { data } = await getOrCreateConversationAPI(friendId);
      setShowNewChat(false);
      setConversations(prev => {
        const exists = prev.find(c => c._id === data._id);
        if (exists) return prev;
        return [data, ...prev];
      });
      openConversation(data);
    } catch {
      toast.error('Failed to open conversation');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;
    const content = text.trim();
    setText('');

    const otherUser = activeConv.participants?.find(p => p._id !== user._id);

    // Optimistic
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: { _id: user._id, name: user.name, profilePicture: user.profilePicture },
      content,
      createdAt: new Date(),
      optimistic: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const { data } = await sendMessageAPI({ conversationId: activeConv._id, receiverId: otherUser?._id, content });
      setMessages(prev => prev.map(m => m._id === tempMsg._id ? data : m));
      sendSocketMessage(user._id, otherUser?._id, content);

      // Update conversation preview
      setConversations(prev => prev.map(c =>
        c._id === activeConv._id ? { ...c, lastMessage: data } : c
      ));
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
      toast.error('Failed to send message');
      setText(content);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!activeConv) return;
    const otherUser = activeConv.participants?.find(p => p._id !== user._id);
    emitTyping(user._id, otherUser?._id);
    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => emitStopTyping(user._id, otherUser?._id), 1500));
  };

  const getOtherUser = (conv) => conv.participants?.find(p => p._id !== user._id);

  const filteredFriends = friends.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messenger-page">
      {/* Conversation List */}
      <div className="conversation-list">
        <div className="conversation-list-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Chats</span>
            <button
              onClick={() => setShowNewChat(p => !p)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-text)' }}
              title="New message"
              type="button"
            >
              <EditIcon size={16} />
            </button>
          </div>
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <SearchIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-text)' }} />
            <input
              type="text"
              placeholder="Search Messenger"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg)', border: 'none', borderRadius: '20px', outline: 'none', fontSize: '15px', color: 'var(--dark-text)' }}
            />
          </div>
        </div>

        {showNewChat && (
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', marginBottom: '8px' }}>Start a new chat</p>
            {filteredFriends.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>No friends found</p>
            ) : filteredFriends.map(friend => (
              <div
                key={friend._id}
                className="conversation-item"
                onClick={() => startConversationWithFriend(friend._id)}
              >
                <div className="conversation-avatar">
                  {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt={friend.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: 16 }}>{friend.name?.[0]?.toUpperCase()}</div>
                  )}
                  {isUserOnline(friend._id) && <div className="online-indicator" />}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{friend.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          Array(5).fill(null).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 12px', margin: '0 8px' }}>
              <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '80%', height: 12 }} />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--secondary-text)' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
              <MessageIcon size={24} />
            </div>
            <p>No conversations yet</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Start chatting with friends!</p>
          </div>
        ) : (
          conversations.map(conv => {
            const other = getOtherUser(conv);
            if (!other) return null;
            return (
              <div
                key={conv._id}
                className={`conversation-item ${activeConv?._id === conv._id ? 'active' : ''}`}
                onClick={() => openConversation(conv)}
              >
                <div className="conversation-avatar">
                  {other.profilePicture ? (
                    <img src={other.profilePicture} alt={other.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: 20 }}>{other.name?.[0]?.toUpperCase()}</div>
                  )}
                  {isUserOnline(other._id) && <div className="online-indicator" />}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{other.name}</div>
                  <div className="conversation-preview">
                    {conv.lastMessage?.content
                      ? `${conv.lastMessage.sender === user._id ? 'You: ' : ''}${conv.lastMessage.content}`
                      : 'Start a conversation'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Window */}
      {activeConv ? (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            {(() => {
              const other = getOtherUser(activeConv);
              return (
                <>
                  <div style={{ position: 'relative' }}>
                    {other?.profilePicture ? (
                      <img src={other.profilePicture} alt={other.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: 16 }}>{other?.name?.[0]?.toUpperCase()}</div>
                    )}
                    {isUserOnline(other?._id) && <div className="online-indicator" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{other?.name}</div>
                    <div style={{ fontSize: '13px', color: isUserOnline(other?._id) ? 'var(--primary)' : 'var(--secondary-text)' }}>
                      {isUserOnline(other?._id) ? 'Active now' : 'Offline'}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messagesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
                {Array(4).fill(null).map((_, index) => (
                  <div key={index} className={`message-bubble-wrap ${index % 2 === 0 ? '' : 'own'}`}>
                    <div className={`skeleton ${index % 2 === 0 ? '' : ''}`} style={{ width: index % 2 === 0 ? '42%' : '34%', height: 44, borderRadius: 18 }} />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-text)' }}>
                <div className="empty-state-icon" style={{ marginBottom: '12px' }}>
                  <MessageIcon size={24} />
                </div>
                <p>Say hello to {getOtherUser(activeConv)?.name}!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isOwn = msg.sender?._id === user._id || msg.sender === user._id;
                const showAvatar = !isOwn && (i === 0 || messages[i - 1]?.sender?._id !== msg.sender?._id);
                return (
                  <div key={msg._id} className={`message-bubble-wrap ${isOwn ? 'own' : ''}`}>
                    {!isOwn && showAvatar && (() => {
                      const sender = getOtherUser(activeConv);
                      return sender?.profilePicture ? (
                        <img src={sender.profilePicture} alt={sender.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>{sender?.name?.[0]?.toUpperCase()}</div>
                      );
                    })()}
                    {!isOwn && !showAvatar && <div style={{ width: 28, flexShrink: 0 }} />}
                    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`} style={{ opacity: msg.optimistic ? 0.7 : 1 }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            {isTyping && (
              <div className="message-bubble-wrap">
                <div className="message-bubble other" style={{ padding: '10px 16px' }}>
                  <span style={{ display: 'flex', gap: '3px' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 8, height: 8, background: 'var(--secondary-text)', borderRadius: '50%', animation: `bounce 1.4s ${i * 0.2}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Aa"
              value={text}
              onChange={handleTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={!text.trim()}>
              <SendIcon size={16} strokeWidth={2.4} />
            </button>
          </form>
        </div>
      ) : (
        <div className="chat-empty">
          <div className="empty-state-icon"><MessageIcon size={28} /></div>
          <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Your Messages</h3>
          <p>Send private photos and messages to a friend.</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', fontSize: '15px', marginTop: '8px' }} onClick={() => setShowNewChat(true)}>
            Send message
          </button>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Messenger;
