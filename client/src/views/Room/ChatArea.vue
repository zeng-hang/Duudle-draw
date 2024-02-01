<template>
  <div ref="chatArea" class="chat-area">
    <div
      v-for="(item, index) in messageList"
      :key="index"
      :class="{
          'chat-item': true,
          'is-self': item.userName === props.userInfo.userName,
        }"
    >
      <user-avatar
        style="width: 38px; height: 38px; margin-top: 4px;"
        :bg-color="item.avatarBgColor"
        :user-name="item.userName"
      />
      <div class="chat-content">
        <span class="user-name">{{ item.userName }}</span>
        <span class="content">{{ item.content }}</span>
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
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";
import {emitSocket, useSocketOn} from "@/utils/socketIo.js";

defineOptions({
  name: "ChatArea"
})

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
})


const messageList = ref([]);
useSocketOn('message', (message) => {
  messageList.value.push(message);
  nextTick(() => {
    chatArea.value.scroll({
      top: chatArea.value.scrollHeight,
      behavior: 'smooth',
    })
  })
});


const message = ref('');
const chatArea = ref(null);
const handleSendMessage = () => {
  if (message.value.length === 0) {
    return;
  }

  emitSocket('message', message.value)

  message.value = '';
}

const router = useRouter();
const handleBack = () => {
  router.back();
}

</script>

<style scoped>

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


.operate-area {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  background: #F2F2F2;
  z-index: 9;
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
  margin-right: 10px;
  padding: 0 10px;
  font-size: 16px;
  box-sizing: border-box;
}
</style>
