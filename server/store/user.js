import db from './index.js'

const users = db.data.users

const genUser = (user) => {
  if (!user.userName) {
    throw new Error('用户名不能为空')
  }

  return {
    userName: user.userName,
    avatarBgColor: user.avatarBgColor || '#000',
    historyRooms: [],
    hasGame: false,
    room: null
  }
}

export const addUser = async (user) => {
  if (users[user.userName]) {
    return users[user.userName];
  }

  users[user.userName] = genUser(user);
  await db.write();

  return users[user.userName];
}

export const getUser = (userName) => {
  return users[userName];
}

export const updateHistoryRooms = async (userName, roomName) => {
  const user = getUser(userName);
  if (!user) {
    throw new Error('用户不存在');
  }

  const historyRooms = user.historyRooms;
  const index = historyRooms.findIndex(item => item.userName === roomName);
  let room;
  if (index !== -1) {
    room = historyRooms.splice(index, 1)[0];
  } else {
    const owner = getUser(roomName);
    room = {
      userName: owner.userName,
      avatarBgColor: owner.avatarBgColor,
      time: new Date().getTime()
    }
  }
  historyRooms.unshift(room);

  await db.write();
  return historyRooms;
}
