module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinChat', (chat_id) => {
      socket.join(chat_id);
      console.log(`User joined chat: ${chat_id}`);
    });

    socket.on('sendMessage', (message) => {
      io.to(message.chat_id).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
