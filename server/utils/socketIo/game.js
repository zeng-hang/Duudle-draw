const getRoom = (rooms, socket, user) => {
  const room = rooms[user.room];
  if (!room) {
    socket.emit('error', '房间不存在');
    // throw new Error('房间不存在');
  }
  return room;
}

export default ({socket, user, rooms, io}) => {
  socket.on('startGame', () => {
    const room = getRoom(rooms, socket, user);
    room.startGame(socket);
  });

  socket.on('ready', (userName) => {
    const room = getRoom(rooms, socket, user);
    if (!room) {
      return;
    }
    socket.emit('preparatives', room.getPreparatives());
    socket.emit('currentAuditor', room.getCurrentAuditor());
    room.allReady(socket, userName);
  });

  ['mm', 'md', 'mu', 'bg', 'color', 'clear', 'undo', 'brush'].forEach(event => {
    socket.on(event, (p) => {
      const room = getRoom(rooms, socket, user);
      if (!room) {
        return;
      }
      socket.to(room.owner).emit(event, p);
    });
  });

  socket.on('pushDrawStack', (data) => {
    const room = getRoom(rooms, socket, user);
    if (!room) {
      return;
    }
    room.pushDrawStack(data);
  });

  socket.on('popDrawStack', () => {
    const room = getRoom(rooms, socket, user);
    if (!room) {
      return;
    }
    room.popDrawStack();
  });

  socket.on('sync', () => {
    const room = getRoom(rooms, socket, user);
    if (!room) {
      return;
    }
    socket.emit('sync', room.drawStack);
  });

  socket.on('answer', (answer) => {
    const room = getRoom(rooms, socket, user);
    room.validAnswer(socket, answer);
  });
}
