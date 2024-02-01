<template>
  <div class="flex-container">
    <head-bar
      :title="`${route.params.roomId}的房间`"
      :description="`${contestant.length}人在线`"
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
          >
            空缺
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
          @click="handleStartGame"
        >
          {{
            userInfo.seatIndex !== 0
              ? '第一个位置有权开始游戏' : preparativeNum > 1
                ? '开始游戏' : '两人以上可开始游戏'
          }}
        </bubble-button>
      </div>
    </div>

    <chat-area :user-info="userInfo"/>

    <div class="auditorium">
      <h3 style="margin: 0; padding: 10px;">观众席</h3>

      <div
        v-if="auditor.length === 0"
        style="text-align: center; padding: 10px;"
      >
        暂无观众
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
  </div>
</template>

<script setup>
import {getUserInfo} from "@/store/localforage.js";
import HeadBar from "@/components/HeadBar.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import BubbleButton from "@/components/BubbleButton.vue";
import ChatArea from "./ChatArea.vue";
import socket, {emitSocket, useSocketOn} from "@/utils/socketIo.js";

defineOptions({
  name: 'Room',
})

socket.once('roomUsers', (users) => {
  contestant.value.push(...users);
  preparative.value.forEach((item) => {
    item.userInfo = contestant.value.find((user) => user.seatIndex === item.seatIndex);
  })
});

useSocketOn('joinRoom', (userInfo) => {
  if (contestant.value.some((item) => item.userName === userInfo.userName)) {
    return;
  }
  contestant.value.push(userInfo);
});

useSocketOn('leaveRoom', (userName) => {
  const index = contestant.value.findIndex((item) => item.userName === userName);
  if (index === -1) {
    return;
  }

  contestant.value.splice(index, 1);
  preparative.value.forEach((item) => {
    if (item.userInfo?.userName === userName) {
      item.userInfo = null;
    }
  })
});

useSocketOn('reSeat', (userInfo) => {
  const user = contestant.value.find((item) => item.userName === userInfo.userName);
  user.seatIndex = userInfo.seatIndex;
  if (userInfo.seatIndex == null) {
    const preparativeUser = preparative.value.find(item => item.userInfo?.userName === userInfo.userName);
    preparativeUser.userInfo = null;
    return;
  }
  preparative.value[userInfo.seatIndex].userInfo = user;
});
const userInfo = ref({});
const route = useRoute();

getUserInfo().then((res) => {
  userInfo.value = res;
  emitSocket('joinRoom', route.params.roomId);
})

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

    emitSocket('reSeat', seatIndex);
    return;
  }

  if (seatUserInfo.userName === userInfo.value.userName) {
    handleQuitGame(prevSeatIndex);
    emitSocket('reSeat', null);
  }
}

const handleQuitGame = (seatIndex) => {
  quitGame(seatIndex);
  emitSocket('reSeat', null);
}

const quitGame = (seatIndex) => {
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
const handleStartGame = () => {
  router.push({
    path: '/game'
  })
}

onUnmounted(() => {
  emitSocket('leaveRoom');
})
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
  width: calc(100% - 40px);
  max-width: 540px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.seats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 10px;
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
    background: #ccc;
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

.auditorium {
  width: 100%;
  position: relative;
  gap: 10px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding-bottom: 10px;
  margin-bottom: 80px;
}

</style>
