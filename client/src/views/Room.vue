<template>
  <div class="flex-container">
    <head-bar
      title="xxx的房间"
      description="10人在线"
      :user-info="userInfo"
    />

    <div class="preparative-seats">
      <div class="seats">
        <div
          class="seat-item"
          v-for="item in preparative"
          :key="item.seatIndex"
        >
          <div
            v-if="!item.userInfo"
            class="placeholder"
            @click="handleJoinGame(item.seatIndex)"
          >空缺
          </div>

          <div
            v-if="item.userInfo"
            class="user-info"
            @click="handleQuitGame(item.seatIndex)"
          >
            <user-avatar
              :bg-color="item.userInfo.avatarBgColor"
              :user-name="item.userInfo.userName"
            />
            <span class="user-name text-overflow">{{ item.userInfo.userName }}</span>
          </div>
        </div>
      </div>

      <div style="text-align: center; padding: 10px;">
        <bubble-button
          style="font-size: 1em; width: 80%; min-width: 220px; box-sizing: border-box; padding: 10px 0;"
          :disabled="userInfo.seatIndex !== 0 || preparativeNum < 2"
        >
          {{
            userInfo.seatIndex !== 0
              ? '第一个位置有权开始游戏' : preparativeNum > 1
                ? '开始游戏' : '两人以上可开始游戏'
          }}
        </bubble-button>
      </div>
    </div>

    <div ref="chatArea" class="chat-area">
      <div
        v-for="(item, index) in messageList"
        :key="index"
        :class="{
          'chat-item': true,
          'is-self': item.userName === userInfo.userName,
        }"
      >
        <user-avatar
          style="width: 38px; height: 38px; margin-top: 4px;"
          :bg-color="item.avatarBgColor"
          :user-name="item.userName"
        />
        <div class="chat-content">
          <span class="user-name">{{ item.userName }}</span>
          <span class="content">{{ item.content}}</span>
        </div>
      </div>
    </div>

    <div class="auditorium">
      <h3 style="margin: 0; padding: 10px;">观众席</h3>

      <div
        v-if="auditor.length === 0"
        style="text-align: center; padding: 10px;"
      >暂无观众
      </div>

      <div v-else style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
        <div
          v-for="item in auditor"
          class="user-info"
        >
          <user-avatar
            :bg-color="item.avatarBgColor"
            :user-name="item.userName"
          />
          <span class="user-name text-overflow">{{ item.userName }}</span>
        </div>
      </div>
    </div>

    <div class="operate-area">
      <button @click="handleBack">返回</button>
      <input
        v-model="message"
        placeholder="这里可以聊天"
        maxlength="20"
        @keyup.enter="handleSendMessage"
      >
    </div>
  </div>
</template>

<script setup>
import { getUserInfo } from "@/store/localforage.js";
import HeadBar from "@/components/HeadBar.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import BubbleButton from "@/components/BubbleButton.vue";

defineOptions({
  name: 'Room',
})

const userInfo = ref({});

const route = useRoute();
if (!route.query.userName) {
  getUserInfo().then((res) => {
    userInfo.value = res;
    contestant.value.unshift(res);
  })
} else {
  userInfo.value = {
    // userName: route.query.userName,
    // avatarBgColor: route.query.avatarBgColor,
  }
}

const contestant = ref([]);


const preparative = ref(new Array(6).fill(0).map((item, index) => {
  return {
    seatIndex: index,
    userInfo: null,
  }
}));
const preparativeNum = computed(() => {
  return preparative.value.filter((item) => item.userInfo != null).length;
});

const handleJoinGame = (seatIndex) => {
  const prevSeatIndex = userInfo.value.seatIndex;
  if (prevSeatIndex != null) {
    handleQuitGame(prevSeatIndex);
  }

  const seatUserInfo = preparative.value[seatIndex].userInfo;
  if (seatUserInfo == null) {
    userInfo.value.seatIndex = seatIndex;
    preparative.value[seatIndex].userInfo = userInfo.value;
    return;
  }

  if (seatUserInfo.userName === userInfo.value.userName) {
    handleQuitGame(prevSeatIndex);
  }
}

const handleQuitGame = (seatIndex) => {
  const seatUserInfo = preparative.value[seatIndex].userInfo;
  if (seatUserInfo == null) {
    return;
  }

  if (seatUserInfo.userName === userInfo.value.userName) {
    preparative.value[seatIndex].userInfo = null;
    userInfo.value.seatIndex = null;
  }
}

const auditor = computed(() => {
  return contestant.value.filter((item) => item.seatIndex == null);
})

const router = useRouter();
const handleBack = () => {
  router.back();
}


const messageList = ref([]);
const message = ref('');
const chatArea = ref(null);
const handleSendMessage = () => {
  if (message.value.length === 0) {
    return;
  }


  messageList.value.push({
    userName: userInfo.value.userName,
    avatarBgColor: userInfo.value.avatarBgColor,
    content: message.value,
  });
  message.value = '';

  nextTick(() => {
    chatArea.value.scroll({
      top: chatArea.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 20px;
}

.preparative-seats {
  width: 80%;
  max-width: 540px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.seats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.seat-item {
  flex: 0 0 60px;
  height: 70px;
  display: flex;
  justify-content: center;
}

.seat-item .placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

@media (hover: hover) {
  .seat-item .placeholder:hover {
    background: #f0f0f0;
  }
}

.seat-item .placeholder:active {
  background: #ccc;
}

.user-info {
  width: 60px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none;
}

.user-info .user-name {
  width: 100%;
  font-size: 12px;
  color: #999;
}

.chat-area {
  height: 200px;
  overflow: auto;
  background: #fff;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chat-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.chat-item .chat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.chat-item.is-self {
  flex-direction: row-reverse;
}

.chat-item.is-self .chat-content {
  align-items: flex-end;
}

.chat-content .user-name {
  font-size: 12px;
  color: #999;
}

.chat-content .content {
  position: relative;
  font-size: 14px;
  color: #000;
  border-radius: 8px;
  padding: 10px;
  background: #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.auditorium {
  width: 100%;
  position: relative;
  gap: 10px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 80px;
}

.operate-area {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  background: #F2F2F2;
}

.operate-area button {
  all: unset;
  flex: 0 0 54px;
  min-width: 54px;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  user-select: none;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fefefe;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  margin: 0 10px;
}

.operate-area input {
  all: unset;
  flex: 1 1 auto;
  width: 100%;
  height: 54px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fefefe;
  padding: 0 10px;
  font-size: 16px;
  box-sizing: border-box;
}
</style>
