import {createServer} from "node:http";
import {Server} from "socket.io";
import db from "@/store";
import {getUser} from "@/store/user.js";
import roomHandler from "@/utils/socketIo/room";
import gameHandler from "@/utils/socketIo/game";

let io;
const rooms = {};
const userSocketMap = {};
const connectHandler = (socket) => {
  console.log('socket connected');
  let user;

  socket.on('online', (userName) => {
    // 查询用户是否有未结束的游戏
    user = getUser(userName);
    if (!user) {
      socket.emit('error', '用户不存在');
      return;
    }
    userSocketMap[userName] = socket;

    if (user.hasGame) {
      socket.emit('hasGame', user.room);
    }

    // 查询用户历史房间
    const historyRooms = user.historyRooms;
    historyRooms.forEach(room => {
      room.status = rooms[room.userName] ? 'online' : 'offline';
    });
    socket.emit('historyRooms', historyRooms);

    roomHandler({socket, user, rooms, io});
    gameHandler({socket, user, rooms, io});
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected');
    db.write();
    delete userSocketMap[user.userName];
    user = null;
    socket = null;
  });
}

export const emitByUserName = (userName, eventName, data) => {
  const socket = userSocketMap[userName];
  if (!socket) return;
  socket.emit(eventName, data);
}


export default function (app) {
  const httpServer = createServer(app);
  io = new Server(httpServer, {
    path: "/buudle/connect"
  });

  io.on('connection', connectHandler);

  const noticeRoomStatus = (room, status) => {
    const users = Object.values(db.data.users);
    users.forEach(user => {
      const index = user.historyRooms.findIndex(item => item.userName === room);
      if (index !== -1) {
        emitByUserName(user.userName, 'roomStatus', {
          room: room,
          status: status
        });
      }
    });
  }

  io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`);
    if (rooms[room]) return;
    noticeRoomStatus(room, 'online');
  });

  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has leave room ${room}`);
    if (!rooms[room]) return;
    if (!rooms[room].users[id]) return;

    const leaveUser = rooms[room].users[id];
    delete rooms[room].users[id];

    io.to(room).emit('leaveRoom', leaveUser.userName);

    if (Object.keys(rooms[room].users).length === 0) {
      delete rooms[room];
      io.of('/').adapter.rooms.delete(room);

      // 找到所有历史房间中有此房间的用户
      noticeRoomStatus(room, 'offline');
    }
  });

  return httpServer;
}
