import {createServer} from "node:http";
import {Server} from "socket.io";
import db from "@/store";
import {getUser} from "@/store/user.js";
import RoomHandler from "@/utils/socketIo/room";

let io;
const rooms = {};
const connectHandler = (socket) => {
  console.log('socket connected');
  let user;

  socket.on('online', (userName) => {
    // 查询用户是否有未结束的游戏
    user = getUser(userName);
    if (user.hasGame) {
      socket.emit('hasGame', user.room);
    }

    // 查询历史房间是否在线
    const historyRooms = user.historyRooms;
    const onlineHistoryRooms = [];
    historyRooms.forEach(room => {
      if (rooms[room.userName]) {
        onlineHistoryRooms.push(room);
      }
    });
    socket.emit('onlineHistoryRooms', onlineHistoryRooms);

    RoomHandler({socket, user, rooms, io});


  });

  socket.on('disconnect', () => {
    console.log('socket disconnected');
    db.write();
    user = null;
  });
}


export default function (app) {
  const httpServer = createServer(app);
  io = new Server(httpServer, {
    path: "/buudle/connect"
  });

  io.on('connection', connectHandler);

  return httpServer;
}
