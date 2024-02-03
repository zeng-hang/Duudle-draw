<template>
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
        style="width: 40px; height: 40px;"
        :bg-color="item.avatarBgColor"
        :user-name="item.userName"
      />
      <span class="user-name">{{ item.userName }}</span>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";

defineOptions({
  name: "GameAudience"
})

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
</script>

<style scoped>
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

.user-info .user-name {
  width: 100%;
  font-size: 12px;
  color: #999;
}

.user-avatar.active + .user-name {
  color: #2196F3;
}

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
</style>
