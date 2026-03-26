import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        transports: ['websocket'],
      });

      socketRef.current.emit('addUser', user._id);

      socketRef.current.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socketRef.current.on('getMessage', (message) => {
        setIncomingMessage(message);
      });

      socketRef.current.on('getNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  const sendSocketMessage = (senderId, receiverId, message) => {
    socketRef.current?.emit('sendMessage', { senderId, receiverId, message });
  };

  const sendSocketNotification = (receiverId, notification) => {
    socketRef.current?.emit('sendNotification', { receiverId, notification });
  };

  const emitTyping = (senderId, receiverId) => {
    socketRef.current?.emit('typing', { senderId, receiverId });
  };

  const emitStopTyping = (senderId, receiverId) => {
    socketRef.current?.emit('stopTyping', { senderId, receiverId });
  };

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      onlineUsers,
      notifications,
      setNotifications,
      incomingMessage,
      setIncomingMessage,
      sendSocketMessage,
      sendSocketNotification,
      emitTyping,
      emitStopTyping,
      isUserOnline,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
