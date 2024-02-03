import {getUser, updateHistoryRooms, updateUserGameStatus} from "@/store/user";

class User {
  constructor(userName, avatarBgColor) {
    this.userName = userName;
    this.avatarBgColor = avatarBgColor;
    this.seatIndex = null;
    this.hasGame = false;
    this.scores = [];
  }

  getCurrentScore() {
    return this.scores[this.scores.length - 1];
  }

  setCurrentScore(score) {
    this.scores[this.scores.length - 1] = score;
  }

  getTotalScore() {
    return this.scores.reduce((prev, next) => prev + next, 0);
  }

  pushScore(score) {
    this.scores.push(score);
  }
}

export default class Room {
  #preparatives;

  constructor(owner, io) {
    this.io = io;
    this.owner = owner;
    this.users = {};
    this.#preparatives = [];
    this.status = 'ready';
    this.startTimeId = null;
    this.gameCount = 0;
    this.currentGameCount = -1;
    this.drawStack = [];
    this.currentQuestion = {
      question: ['四个字', '一种动物', '陆地上的'],
      answer: '狮子'
    };
    this.correctUsers = [];
  }

  pushDrawStack(data) {
    this.drawStack.push(data);
  }

  popDrawStack() {
    this.drawStack.pop();
  }

  addUser(id, user) {
    if (user instanceof User) {
      this.users[id] = user;
    } else {
      this.users[id] = new User(user.userName, user.avatarBgColor);
    }
    this.io.to(this.owner).emit('joinRoom', user)
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
    if (!userInfo) {
      return;
    }
    userInfo.seatIndex = seatIndex;
    this.#computedPreparatives();
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
    this.io.to(this.owner).emit('startGame');
    this.#computedGameCount();

    this.startTimeId = setTimeout(() => {
      this.io.to(this.owner).emit('allReady');
      this.status = 'gaming';
      this.nextGame();
    }, 1000 * 15);
  }

  allReady(socket, userName) {
    let user = this.getUser(socket.id)
    if (!user) {
      user = getUser(userName);
      socket.join(this.owner);
      const preparatives = this.getPreparatives();
      const index = preparatives.findIndex(item => item.userName === user.userName);
      if (index !== -1) {
        const user = preparatives[index]
        this.addUser(socket.id, user);
      } else {
        this.addUser(socket.id, {
          userName: user.userName,
          avatarBgColor: user.avatarBgColor
        })
      }
    }

    const preparatives = this.getPreparatives();
    const preparative = preparatives[user.seatIndex];
    if (preparative) {
      preparative.hasGame = true;
      updateUserGameStatus(user.userName, this.owner, true).then(() => {
        socket.to(this.owner).emit('ready', user);
        if (this.status === "ready" && preparatives.every(user => user.hasGame)) {
          this.io.to(this.owner).emit('allReady');
          this.status = 'gaming';
          this.nextGame();
          clearTimeout(this.startTimeId);
        }
      });
    }
  }

  #computedGameCount() {
    const preparativesNum = this.getPreparatives().length;
    let gameCount = preparativesNum * 2;
    while (gameCount < 8) {
      gameCount += preparativesNum;
    }
    this.gameCount = gameCount;
  }

  #computedPreparatives() {
    this.#preparatives = this.getUsers().filter(user => user.seatIndex != null).sort((a, b) => a.seatIndex - b.seatIndex);
  }

  getPreparatives() {
    return this.#preparatives;
  }

  getCurrentAuditor() {
    if (this.currentGameCount === -1) {
      return this.#preparatives[0];
    }

    return this.#preparatives[this.currentGameCount % this.#preparatives.length];
  }

  validAnswer(socket, answer) {
    if (this.currentQuestion == null) {
      return;
    }

    if (answer == null || answer === '') {
      return;
    }

    const user = this.getUser(socket.id);
    if (!user) {
      return;
    }

    if (this.correctUsers.includes(user.userName)) {
      return;
    }

    const hasPreparative = user.seatIndex != null;
    if (answer === this.currentQuestion.answer) {
      let score = 3 - this.correctUsers.length;
      score = score < 1 ? 1 : score;
      score = hasPreparative ? score : 1;
      user.setCurrentScore(score);
      this.correctUsers.push(user.userName);
      this.io.to(this.owner).emit('answer', {
        userName: user.userName,
        message: '回答正确',
        score: score,
        hasPreparative
      });
    } else {
      this.io.to(this.owner).emit('answer', {
        userName: user.userName,
        message: answer,
        hasPreparative
      });
    }

    if (this.correctUsers.length + 1 === this.#preparatives.length) {
      this.nextGame();
    }
  }

  nextGame() {
    this.drawStack = [];
    this.correctUsers = [];
    this.currentGameCount++;
    if (this.currentGameCount >= this.gameCount) {
      this.io.to(this.owner).emit('gameOver');
      this.status = 'ready';
      this.currentGameCount = -1;
      this.#preparatives.forEach(user => {
        user.hasGame = false;
        updateUserGameStatus(user.userName, this.owner, false);
      });
      return;
    }
    Object.values(this.users).forEach(user => {
      user.pushScore(0)
    });
    this.io.to(this.owner).emit('nextGame', {
      gameCount: this.gameCount,
      currentGameCount: this.currentGameCount,
      currentAuditor: this.getCurrentAuditor(),
      // question: this.currentQuestion.question,
    });
  }
}
