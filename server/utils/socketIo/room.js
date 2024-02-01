export default function ({socket, user, rooms, io}) {
  io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`);
  });

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has leave room ${room}`);
    if (!rooms[room]) return;
    if (!rooms[room].users[id]) return;

    const leaveUser = rooms[room].users[id];
    delete rooms[room].users[id];

    io.to(room).emit('leaveRoom', leaveUser.userName);
  });

  io.of('/').adapter.on('delete-room', (room) => {
    console.log(`room ${room} was deleted`);
  });

  socket.on('joinRoom', (room) => {
    user.room = room;
    user.hasGame = false;
    socket.join(room)

    const userInfo = {
      userName: user.userName,
      avatarBgColor: user.avatarBgColor,
      seatIndex: null
    }

    if (!rooms[room]) {
      rooms[room] = {
        owner: user.userName,
        users: {}
      }
    }

    socket.emit('roomUsers', Object.values(rooms[room].users));
    rooms[room].users[socket.id] = userInfo;
    io.to(room).emit('joinRoom', userInfo);
  });

  socket.on('reSeat', (seatIndex) => {
    const room = rooms[user.room];
    const userInfo = room.users[socket.id];
    userInfo.seatIndex = seatIndex;
    io.to(user.room).emit('reSeat', userInfo);
  });
}
