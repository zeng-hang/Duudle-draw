<template>
  <div class="flex-container">
    <div class="wrap">
      <user-avatar
        style="width: 80px; height: 80px; margin: -40px auto 0 auto;"
        v-model:bg-color="userInfo.avatarBgColor"
        :user-name="userInfo.userName"
        has-change-bg-color
      />
      <div class="form">
        <input
          v-model="userInfo.userName"
          placeholder="请输入用户名"
          maxlength="10"
        >
        <button
          :disabled="userInfo.userName.length === 0"
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
import { addUser } from "@/api/index.js";
import { setUserInfo } from "@/store/localforage.js";
import UserAvatar from "@/components/UserAvatar.vue";

defineOptions({
  name: 'Register',
})

const genRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

const userInfo = ref({
  userName: '',
  avatarBgColor: genRandomColor(),
});


const router = useRouter();
const handleEnterGame = async () => {
  if (userInfo.value.userName.length === 0) {
    return
  }

  const data = {
    userName: userInfo.value.userName,
    avatarBgColor: userInfo.value.avatarBgColor,
  }

  const { data: user } = await addUser(data);
  await setUserInfo(user);

  await router.push('/home');
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
