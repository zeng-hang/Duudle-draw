<template>
  <div class="flex-container">
    <head-bar title="你画我猜" :user-info="userInfo"/>

    <div class="join-room">
      <bubble-button @click="gotoRoom()">
        我的房间
      </bubble-button>
    </div>

    <div class="sundry" style="max-height: 300px; overflow:auto;">
      <h3 class="title">历史房间</h3>
      <div
        v-for="item in historyRooms"
        :class="{
          'history-room': true,
          'online': item.status === 'online',
        }"
        @click="gotoRoom(item.userName)"
      >
        <user-avatar
          :user-name="item.userName"
          :bg-color="item.avatarBgColor"
        />
        <div class="info">
          <div class="name">
            <span class="text-overflow">{{ item.userName }}</span>
            <span style="flex: 0 0 max-content;">的房间</span>
          </div>
          <div class="time">{{ new Date(item.time).toLocaleString()}}</div>
        </div>
      </div>
    </div>

    <div class="sundry">
      <h3 class="title">作品推荐</h3>
    </div>
  </div>
</template>

<script setup>
import {getUserInfo, getHistoryRooms} from "@/store/localforage.js";
import UserAvatar from "@/components/UserAvatar.vue";
import HeadBar from "@/components/HeadBar.vue";
import BubbleButton from "@/components/BubbleButton.vue";
import socket, {useSocketOn} from "@/utils/socketIo.js";

defineOptions({
  name: 'Home',
})

useSocketOn('invite', () => {
  console.log('invite');
});

useSocketOn('hasGame', () => {
  console.log('hasGame');
});

const userInfo = ref({});
getUserInfo().then((res) => {
  userInfo.value = res;
})

const historyRooms = getHistoryRooms();

const router = useRouter();
const gotoRoom = (roomId) => {
  if (!roomId) {
    roomId = userInfo.value.userName;
  }

  router.push('/room/' + roomId);
}
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
}

.join-room {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 260px;
}

.sundry {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 300px;
  overflow: auto;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.sundry .title {
  position: sticky;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  flex-shrink: 0;
  margin: 0;
  padding: 8px;
  z-index: 9;
  box-sizing: border-box;
}

.history-room {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 16px;
  width: clamp(200px, 100%, 300px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: #FAFAFA;
  box-sizing: border-box;
}

.history-room.online::before {
  content: '在线';
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 8px;
  font-size: 12px;
  color: #fff;
  background: #00C853;
  border-radius: 0 0 0 16px;
  box-sizing: border-box;
}

@media (hover: hover) {
  .history-room:hover {
    background: #f0f0f0;
  }
}

.history-room:active {
  background: #e0e0e0;
}

.history-room .info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 12px;
  color: #999;
}

.history-room .info .name {
  min-width: 0;
  display: flex;
  font-weight: 700;
  font-size: 16px;
  color: #000;
}
</style>
