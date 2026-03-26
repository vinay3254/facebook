const onlineUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // User comes online
    socket.on('addUser', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });

    // Send message
    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('getMessage', {
          senderId,
          message,
        });
      }
    });

    // Send notification
    socket.on('sendNotification', ({ receiverId, notification }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('getNotification', notification);
      }
    });

    // Typing indicator
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId });
      }
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stopTyping', { senderId });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      });
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      console.log('Socket disconnected:', socket.id);
    });
  });
};
