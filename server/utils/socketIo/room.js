import {getUser} from "@/store/user";
import Room from './RoomEntity';


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

  socket.on('joinRoom', (roomName) => {
    const owner = getUser(roomName);
    if (!owner) {
      socket.emit('error', '房间不存在');
      return;
    }

    user.room = roomName;
    user.hasGame = false;
    socket.join(roomName)

    const userInfo = {
      userName: user.userName,
      avatarBgColor: user.avatarBgColor
    }

    let room = rooms[roomName];
    if (!room) {
      rooms[roomName] = room = new Room(roomName, io);
    }

    socket.emit('roomUsers', room.getUsers());
    room.status === 'gaming' && socket.emit('startGame');
    room.addUser(socket.id, userInfo);
  });

  socket.on('reSeat', (seatIndex) => {
    const room = rooms[user.room];
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }
    room.reSeat(seatIndex, socket);
  });

  socket.on('leaveRoom', () => {
    socket.leave(user.room);
    // io.to(user.room).emit('leaveRoom', user.userName);
  });

  socket.on('message', (message) => {
    const room = rooms[user.room];
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }
    room.sendMessages(message, user);
  });
}
