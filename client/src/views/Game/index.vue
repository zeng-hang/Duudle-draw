<template>
  <div class="flex-container">
    <div class="draw-container">
      <open-animate :open="openAnimate">
        <template #open-word>
          <div style="font-size: 40px;">游戏即将开始</div>
          <div>请准备好</div>
        </template>

        <div class="topic">
          两个字，是一种动物，四只脚
        </div>

        <draw-board :has-draw="hasAuditor" @sync="openAnimate = false">
          <!--  弹幕消息  -->
          <div class="barrage-message">
            <div
              v-for="item in barrageMessageList"
              :key="item.message"
              class="barrage-message-item"
            >
              <user-avatar
                style="width: 20px; height: 20px;"
                :bg-color="item.avatarBgColor"
                :user-name="item.userName"
              />
              <span :class="{
              message: true,
              success: item.score > 0
            }">{{ item.message }}</span>
            </div>
          </div>
        </draw-board>

        <div v-if="!hasAuditor" class="answer-area">
          <input
            v-model="answer"
            placeholder="请输入答案"
            maxlength="10"
            @keyup.enter="handleAnswer"
            :disabled="self.score > 0"
          >
        </div>
      </open-animate>

    </div>

    <div class="preparatives">
      <div
        v-for="item in preparatives"
        :key="item.userName"
        :class="{
          'user-info': true,
          offline: item.offline
        }"
      >
        <div
          v-if="item.score > 0"
          class="score"
        >
          +{{ item.score }}
        </div>
        <user-avatar
          :class="{
            'user-avatar': true,
            active: item.userName === currentAuditor.userName
          }"
          style="width: 40px; height: 40px; position: relative; overflow: hidden;"
          :bg-color="item.avatarBgColor"
          :user-name="item.userName"
        />
        <span class="user-name">{{ item.userName }}</span>
      </div>
    </div>

    <h3 class="divide-title">观众</h3>

    <div
      v-if="audience.length === 0"
      style="text-align: center; padding: 10px;"
    >
      暂无观众
    </div>
    <div
      v-else
      class="preparatives"
      style="width: 100%; background: unset; border: none; box-shadow: none;"
    >
      <div
        v-for="item in audience"
        :key="item.userName"
        class="user-info"
      >
        <transition name="fade">
          <div
            v-if="item.message"
            class="message-box"
          >
            {{ item.message }}
          </div>
        </transition>
        <user-avatar
          style="width: 40px; height: 40px; position: relative; overflow: hidden;"
          :bg-color="item.avatarBgColor"
          :user-name="item.userName"
        />
        <span class="user-name">{{ item.userName }}</span>
      </div>
    </div>

    <h3 class="divide-title">本场作品</h3>

    <div class="portfolio">
      <div class="opus" v-for="i in 10" :key="i">
        <img alt="opus" src="../../assets/vue.svg">
        <span>作品名称</span>
        <span>作者：小明</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";
import {getUserInfo} from "@/store/localforage.js";
import socket, {emitSocket, useSocketOn} from "@/utils/socketIo.js";
import {genUUID, scrollToBottom} from "@/utils/utils.js";
import OpenAnimate from "@/components/OpenAnimate.vue";
import DrawBoard from "@/views/Game/DrawBoard.vue";

defineOptions({
  name: 'Game',
});

const self = ref({});
getUserInfo().then((res) => {
  self.value = res;
  emitSocket('ready', self.value.userName);
});

const preparatives = ref([]);
socket.once('preparatives', (users) => {
  preparatives.value = users.map((item) => {
    return {
      ...item,
      score: item.scores[item.scores.length - 1]
    };
  });
  const user = preparatives.value.find((item) => item.userName === self.value.userName);
  if (user) {
    self.value.score = user.score;
  }
});


const answer = ref('');
const handleAnswer = () => {
  if (!answer.value) {
    return;
  }

  emitSocket('answer', answer.value);
  answer.value = '';
};

//  弹幕消息
const barrageMessageList = ref([]);
useSocketOn('answer', (message) => {
  const user = preparatives.value.find((item) => item.userName === message.userName);
  if (user) {
    message.id = genUUID();
    message.avatarBgColor = user.avatarBgColor;
    if (message.score != null) {
      preparatives.value.find((item) => item.userName === message.userName).score = message.score;
    }
    if (self.value.userName === message.userName) {
      self.value.score = message.score;
    }
    barrageMessageList.value.push(message);
    scrollToBottom('.barrage-message');
  }
});



const audience = ref([
  {userName: '小明', avatarBgColor: '#FF0000', message: '这是正确答案这是正确答案'},
  {userName: '小红', avatarBgColor: '#FF69B4', message: '1'},
  {userName: '小刚', avatarBgColor: '#FFC0CB'},
  {userName: '小李', avatarBgColor: '#FFA500'},
  {userName: '小王', avatarBgColor: '#FFFF00'},
  {userName: '小明', avatarBgColor: '#FF0000'},
  {userName: '小红', avatarBgColor: '#FF69B4'},
  {userName: '小刚', avatarBgColor: '#FFC0CB'},
  {userName: '小李', avatarBgColor: '#FFA500'},
  {userName: '小王', avatarBgColor: '#FFFF00'},
  {userName: '小明', avatarBgColor: '#FF0000'},
  {userName: '小红', avatarBgColor: '#FF69B4'},
  {userName: '小刚', avatarBgColor: '#FFC0CB'},
  {userName: '小李', avatarBgColor: '#FFA500'},
  {userName: '小王', avatarBgColor: '#FFFF00'},
  {userName: '小明', avatarBgColor: '#FF0000'},
  {userName: '小红', avatarBgColor: '#FF69B4'},
  {userName: '小刚', avatarBgColor: '#FFC0CB'},
  {userName: '小李', avatarBgColor: '#FFA500'},
  {userName: '小王', avatarBgColor: '#FFFF00'},
]);

setInterval(() => {
  const index = Math.floor(Math.random() * audience.value.length);
  const message = audience.value[index];
  message.message = '��';
  setTimeout(() => {
    message.message = '';
  }, 1000);
}, 2000);

const openAnimate = ref(true);

const currentAuditor = ref({});
const hasAuditor = computed(() => {
  return currentAuditor.value.userName === self.value.userName;
});
useSocketOn('currentAuditor', (auditor) => {
  currentAuditor.value = auditor;
  openAnimate.value = true;
});

const gameCount = ref(0);
const currentGameCount = ref(0);
useSocketOn('nextGame', (data) => {
  openAnimate.value = false;
  gameCount.value = data.gameCount;
  currentGameCount.value = data.currentGameCount;
  currentAuditor.value = data.currentAuditor;
})

useSocketOn('joinRoom', (userInfo) => {
  const preparative = preparatives.value.find((item) => item.userName === userInfo.userName);
  if (preparative) {
    preparative.offline = false;
  }
});

useSocketOn('leaveRoom', (userName) => {
  const preparative = preparatives.value.find((item) => item.userName === userName);
  if (preparative) {
    preparative.offline = true;
  }
});

onUnmounted(() => {
  emitSocket('leaveRoom');
})

window.onbeforeunload = () => {
  emitSocket('leaveRoom');
}

</script>

<style scoped>
.flex-container {
  --layout-width: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 10px;
}

.draw-container {
  position: relative;
  flex: 0 0 auto;
  width: var(--layout-width);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}


.topic {
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #ccc;
  background: #e60074;
  color: #fff;
}


.answer-area {
  background: #f0f0f0;
  padding: 10px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
}

.answer-area input {
  flex: 1;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 10px;
  box-sizing: border-box;
  outline: none;
}

.answer-area button {
  flex: 0 0 60px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: #2196F3;
  color: #fff;
  cursor: pointer;
  outline: none;
}

.preparatives {
  background: #fff;
  width: var(--layout-width);
  border-radius: 4px;
  border: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 10px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.user-info {
  position: relative;
  width: 40px;
  min-width: 0;
  height: 60px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  user-select: none;
}

.user-info.offline {
  filter: grayscale(1);
}

.user-info.offline .user-avatar::before {
  content: '离线';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.user-info .user-name {
  width: 100%;
  font-size: 12px;
  color: #999;
}

.user-avatar.active {
  box-shadow: 0 0 0 1px #2196F3, 0 0 2px 2px #4FC3F7;
}

.user-avatar.active + .user-name {
  color: #2196F3;
}


.score,
.message-box {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 16px;
  line-height: 16px;
  border-radius: 20px;
  background: #32CD32;
  color: #fff;
  font-size: 12px;
}

.message-box {
  width: max-content;
  max-width: 100px;
  padding: 4px;
  color: #000;
  height: auto;
  top: 0;
  transform: translateX(-50%) translateY(-100%);
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

/*.score + .user-avatar {
  box-shadow: 0 0 0 1px #32CD32;
}

.score + .user-avatar + .user-name {
  color: #32CD32;
}*/

.barrage-message {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px;
  max-height: 100px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.barrage-message-item {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
}

.barrage-message-item .message {
  font-size: 12px;
  color: #000;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
}

.barrage-message-item .message.success {
  background: #32CD32;
  color: #fff;
}

.divide-title {
  width: 100%;
  background: #fff;
  padding: 10px 0;
  margin: 0;
  text-indent: 1em;
}

.portfolio {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.opus {
  width: var(--layout-width);
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
}

.opus img {
  width: 300px;
  height: 300px;
}

</style>
