import {io} from 'socket.io-client';
import {onUnmounted} from "vue";
import {getUserInfo} from "@/store/localforage.js";

const socket = io({
  path: '/buudle/connect'
});

let hasConnected = false;
const emitQueue = [];
socket.on('connect', async() => {
  hasConnected = true;
  console.log('socket connected');
  const user = await getUserInfo();
  socket.emit('online', user.userName);

  while (emitQueue.length) {
    const {eventName, data} = emitQueue.shift();
    socket.emit(eventName, data);
  }
});

socket.on('disconnect', () => {
  console.log('socket disconnected');
  hasConnected = false;
});

export const useSocketOn = (eventName, callback) => {
  socket.on(eventName, callback);

  onUnmounted(() => {
    socket.off(eventName, callback);
  });
}

export const emitSocket = (eventName, data) => {
  if (!hasConnected) {
    emitQueue.push({eventName, data});
    return;
  }
  socket.emit(eventName, data);
}

export default socket;
