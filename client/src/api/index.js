import api from './axios';

// Auth
export const loginAPI = (data) => api.post('/auth/login', data);
export const registerAPI = (data) => api.post('/auth/register', data);
export const forgotPasswordAPI = (email) => api.post('/auth/forgot-password', { email });
export const resetPasswordAPI = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

// Users
export const getUserAPI = (id) => api.get(`/users/${id}`);
export const updateUserAPI = (id, data) => api.put(`/users/${id}`, data);
export const searchUsersAPI = (q) => api.get(`/users/search?q=${q}`);
export const getUserFriendsAPI = (id) => api.get(`/users/${id}/friends`);
export const getFriendRequestsAPI = () => api.get('/users/friend-requests');

// Friends
export const sendFriendRequestAPI = (id) => api.post(`/friends/request/${id}`);
export const acceptFriendRequestAPI = (id) => api.put(`/friends/accept/${id}`);
export const declineFriendRequestAPI = (id) => api.delete(`/friends/decline/${id}`);
export const unfriendAPI = (id) => api.delete(`/friends/unfriend/${id}`);
export const getFriendSuggestionsAPI = () => api.get('/friends/suggestions');

// Posts
export const getFeedAPI = (page = 1) => api.get(`/posts/feed?page=${page}`);
export const getUserPostsAPI = (id, page = 1) => api.get(`/posts/user/${id}?page=${page}`);
export const createPostAPI = (data) => api.post('/posts', data);
export const updatePostAPI = (id, data) => api.put(`/posts/${id}`, data);
export const deletePostAPI = (id) => api.delete(`/posts/${id}`);
export const likePostAPI = (id) => api.put(`/posts/${id}/like`);
export const addCommentAPI = (id, content) => api.post(`/posts/${id}/comment`, { content });
export const deleteCommentAPI = (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`);

// Messages
export const getConversationsAPI = () => api.get('/conversations');
export const getOrCreateConversationAPI = (userId) => api.post('/conversations', { userId });
export const getMessagesAPI = (conversationId, page = 1) => api.get(`/messages/${conversationId}?page=${page}`);
export const sendMessageAPI = (data) => api.post('/messages', data);

// Notifications
export const getNotificationsAPI = () => api.get('/notifications');
export const markNotificationReadAPI = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsReadAPI = () => api.put('/notifications/read-all');

// Stories
export const getStoriesAPI = () => api.get('/stories');
export const createStoryAPI = (data) => api.post('/stories', data);
export const viewStoryAPI = (id) => api.put(`/stories/${id}/view`);
export const deleteStoryAPI = (id) => api.delete(`/stories/${id}`);
