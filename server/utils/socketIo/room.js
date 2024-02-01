import {updateHistoryRooms, getUser} from "@/store/user";

export default function ({socket, user, rooms, io}) {
  // io.of('/').adapter.on('create-room', (room) => {
  //   console.log(`room ${room} was created`);
  // });
  //
  // io.of('/').adapter.on('join-room', (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // });
  //
  // io.of('/').adapter.on('delete-room', (room) => {
  //   console.log(`room ${room} was deleted`);
  // });

  socket.on('joinRoom', (room) => {
    const owner = getUser(room);
    if (!owner) {
      socket.emit('error', '房间不存在');
      return;
    }

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
        owner: room,
        users: {}
      }
    }

    socket.emit('roomUsers', Object.values(rooms[room].users));
    rooms[room].users[socket.id] = userInfo;
    io.to(room).emit('joinRoom', userInfo);

    updateHistoryRooms(user.userName, room);
  });

  socket.on('reSeat', (seatIndex) => {
    const room = rooms[user.room];
    const seatIndexArr = Object.values(room.users).map(user => user.seatIndex);
    if (seatIndex != null && seatIndexArr.includes(seatIndex)) {
      socket.emit('error', '此座位已被占用');
      return;
    }

    const userInfo = room.users[socket.id];
    userInfo.seatIndex = seatIndex;
    io.to(user.room).emit('reSeat', userInfo);
  });

  socket.on('leaveRoom', () => {
    socket.leave(user.room);
    // io.to(user.room).emit('leaveRoom', user.userName);
  });

  socket.on('message', (message) => {
    io.to(user.room).emit('message', {
      userName: user.userName,
      avatarBgColor: user.avatarBgColor,
      content: message
    });
  });
}
