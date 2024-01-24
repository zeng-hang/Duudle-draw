<template>
  <div class="flex-container">
    <div class="wrap">
      <div
        class="avatar"
        :style="{
          backgroundColor: avatarBgColor
        }"
        @click="changeAvatarBgColor"
      >
        {{ userFirstName }}
      </div>
      <div class="form">
        <input
          v-model="userName"
          placeholder="请输入用户名"
        >
        <button
          :disabled="userFirstName === '?'"
          @click="handleEnterGame"
        >
          进入游戏
        </button>
      </div>
      <div class="note">
        <p>当前使用的用户名可以用于后续保存游戏记录，系统只会保留基础信息，游戏记录存储在用户本地。</p>
        <p>如果换设备重新加入游戏，可以使用相同用户名进行登录，会同步基础信息。</p>
        <p>基础信息包括用户基础信息以及游玩过的历史游戏房间。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { setUserInfo } from "@/store/localforage.js";

defineOptions({
  name: 'Register',
})

const genRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

const userName = ref('')

const avatarBgColor = ref(genRandomColor());
const changeAvatarBgColor = () => {
  avatarBgColor.value = genRandomColor();
}

const userFirstName = computed(() => {
  return userName.value[0]?.toUpperCase() || '?'
});

const router = useRouter();
const handleEnterGame = () => {
  if (userFirstName.value === '?') {
    return
  }

  const userInfo = {
    userName: userName.value,
    avatarBgColor: avatarBgColor.value
  }
  setUserInfo(userInfo).then(() => {
    router.push('/home')
  })

}


</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  height: 100vh;
  min-width: 375px;
}

.wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  width: 100%;
  max-width: 500px;
  margin-top: 100px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  background: #000;
  margin: -40px auto 0;
  border-radius: 50%;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.form input,
.form button {
  all: unset;
  width: 80%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 0 20px;
  font-size: 16px;
  box-sizing: border-box;
  transition: all .3s;
}

.form input:hover,
.form input:focus {
  border-color: #2196F3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form button {
  background: #2196F3;
  color: #fff;
  text-align: center;
  cursor: pointer;
}

.form button:hover,
.form button:focus,
.form button:active {
  background: #1976D2;
}


.form button:disabled {
  background: #ccc;
  color: #fff;
  cursor: not-allowed;
}


.note {
  padding: 20px;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}
</style>
