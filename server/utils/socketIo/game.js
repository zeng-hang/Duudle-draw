export default ({socket, user, rooms, io}) => {
  socket.on('startGame', () => {
    const room = rooms[user.room];
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }

    room.startGame(socket);
  });
}
