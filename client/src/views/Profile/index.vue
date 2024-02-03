<template>
  <div class="flex-container">
    <div class="wrap">
      <div class="back" @click="() => $router.go(-1)">👈返回</div>

      <user-avatar
        style="width: 80px; height: 80px; margin: -40px auto 0 auto;"
        v-model:bg-color="userInfo.avatarBgColor"
        :user-name="userInfo.userName"
        has-change-bg-color
      />
      <span>{{ userInfo.userName }}</span>
    </div>

    <ul class="menu">
      <li class="menu-item" @click="() => $router.push(`/room/${userInfo.userName}`)">🏡我的房间</li>
      <li class="menu-item" @click="() => $router.push('/questions')">📖创建题库</li>
      <li class="menu-item">🏆历史作品</li>
      <li class="menu-item">❤关于</li>
    </ul>
    🥇🥈🥉
  </div>
</template>

<script setup>
import { getUserInfo } from "@/store/localforage.js";
import UserAvatar from "@/components/UserAvatar.vue";

defineOptions({
  name: 'Profile',
})


const userInfo = ref({});
getUserInfo().then((data) => {
  userInfo.value = data;
});




</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  min-width: 375px;
}

.wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  max-width: 500px;
  margin-top: 100px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
}

.back {
  position: absolute;
  top: 0;
  padding: 0 10px;
  cursor: pointer;
  color: #333;
  height: 70px;
  line-height: 70px;
  border-right: 1px solid #f5f5f5;
}

.menu {
  width: 100%;
  max-width: 500px;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  background: white;
}

.menu-item {
  padding: 20px 0 20px 20px;
  border-bottom: 1px solid #f5f5f5;
  text-align: left;
  color: #333;
  font-size: 18px;
  cursor: pointer;
}

@media (hover: hover) {
  .menu-item:hover {
    background: #f5f5f5;
  }
}

.menu-item:active {
  background: #f5f5f5;
}

</style>
