import {updateHistoryRooms, getUser} from "@/store/user";

class Room {
  constructor(owner, io) {
    this.io = io;
    this.owner = owner;
    this.users = {};
    this.status = 'ready'
  }

  addUser(id, user) {
    this.users[id] = user;
    this.io.to(this.owner).emit('joinRoom', user);
    updateHistoryRooms(user.userName, this.owner);
  }

  removeUser(userName) {
    delete this.users[userName];
  }

  getUsers() {
    return Object.values(this.users);
  }

  getUser(id) {
    return this.users[id];
  }

  reSeat(seatIndex, socket) {
    const seatIndexArr = this.getUsers().map(user => user.seatIndex);
    if (seatIndex != null && seatIndexArr.includes(seatIndex)) {
      socket.emit('error', '此座位已被占用');
      return;
    }

    const userInfo = this.getUser(socket.id);
    userInfo.seatIndex = seatIndex;
    this.io.to(this.owner).emit('reSeat', userInfo);
  }

  sendMessages(message, user) {
    this.io.to(this.owner).emit('message', {
      userName: user.userName,
      avatarBgColor: user.avatarBgColor,
      content: message
    });
  }

  startGame(socket) {
    const user = this.getUser(socket.id);
    if (!user || user.seatIndex !== 0) {
      socket.emit('error', '你不是房主');
      return;
    }
    this.status = 'gaming';
    this.io.to(this.owner).emit('startGame');
  }

  getPreparative() {
    return this.getUsers().filter(user => user.seatIndex != null).sort((a, b) => a.seatIndex - b.seatIndex);
  }
}

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
      avatarBgColor: user.avatarBgColor,
      seatIndex: null
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
