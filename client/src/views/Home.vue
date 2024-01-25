<template>
  <div class="flex-container">
    <div class="header">
      <h1 class="colorful-title">你画我猜</h1>
      <user-avatar
        style="margin-left: auto; margin-right: 20px;"
        :bg-color="userInfo.avatarBgColor"
        :user-name="userInfo.userName"
      />
    </div>

    <div class="join-room">
      <button
        ref="bubbleButton"
        class="bubbly-button"
        @click="handleBubbleButtonAnimate"
      >
        我的房间
      </button>
    </div>

    <div class="sundry">
      <h3 class="title">历史房间</h3>
      <div class="history-room">
        <user-avatar user-name="你"/>
        <div class="info">
          <div class="name">
            <span class="text-overflow">我是哈哈哈我是哈哈哈</span>
            <span style="flex: 0 0 max-content;">的房间</span>
          </div>
          <div class="time">2021-08-01 12:00</div>
        </div>
      </div>
      <div class="history-room">
        <user-avatar user-name="你"/>
        <div class="info">
          <div class="name">
            <span class="text-overflow">我是哈哈哈我是哈哈哈</span>
            <span style="flex: 0 0 max-content;">的房间</span>
          </div>
          <div class="time">2021-08-01 12:00</div>
        </div>
      </div>
    </div>

    <div class="sundry">
      <h3 class="title">作品推荐</h3>
    </div>
  </div>
</template>

<script setup>
import { getUserInfo } from "@/store/localforage.js";
import UserAvatar from "@/components/UserAvatar.vue";

defineOptions({
  name: 'Home',
})

const userInfo = ref({});
getUserInfo().then((res) => {
  userInfo.value = res;
})

const bubbleButton = ref(null);
const handleBubbleButtonAnimate = () => {
  bubbleButton.value.classList.remove('animate');
  bubbleButton.value.classList.add('animate');
  setTimeout(() => {
    bubbleButton.value.classList.remove('animate');
  }, 700);
}
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.colorful-title {
  font-size: 24px;
  font-weight: 700;
  margin-left: 20px;
  display: inline;
  text-align: center;
  background-image: linear-gradient(to right, #f782a9 0%, #b48bd9 10%, #4ed9ab 40%, #ffd26b 60%, #f782a9 90%, #f782a9 100%);
  background-size: 200% auto;
  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 10s linear infinite;
}

@keyframes shine {
  100% {
    background-position: 200% center;
  }
}

.join-room {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 260px;
}

.sundry {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  gap: 10px;
}

.sundry .title {
  width: 100%;
  flex-shrink: 0;
  margin: 0;
}

.history-room {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 16px;
  width: calc(50% - 5px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: #FAFAFA;
  box-sizing: border-box;
}

/*查询是否支持 hover */
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

  /* 下面是按钮的样式 */
.bubbly-button {
  --fuschia: #ff0081;
  --button-bg: var(--fuschia);
  --button-bg-dark: #e60074;
  --button-text-color: #fff;
  --baby-blue: #f8faff;

  font-size: clamp(1rem, 3vw, 1.5rem);
  padding: 1em 2em;
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
}

.bubbly-button:focus {
  outline: 0;
}

.bubbly-button:active {
  background-color: var(--button-bg-dark);
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
}

.bubbly-button:before,
.bubbly-button:after {
  position: absolute;
  content: '';
  width: 140%;
  height: 100%;
  left: -20%;
  transition: all ease-in-out 0.5s;
  background-repeat: no-repeat;
}

.bubbly-button:before {
  content: unset;
  top: -75%;
  background-image: radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, transparent 20%, var(--button-bg) 20%, transparent 30%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, transparent 10%, var(--button-bg) 15%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
}

.bubbly-button:after {
  content: unset;
  bottom: -75%;
  background-image: radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, transparent 10%, var(--button-bg) 15%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%),
  radial-gradient(circle, var(--button-bg) 20%, transparent 20%);
  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  //background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
}

.bubbly-button.animate:before {
  content: '';
  animation: topBubbles ease-in-out 0.75s forwards;
}

.bubbly-button.animate:after {
  content: '';
  animation: bottomBubbles ease-in-out 0.75s forwards;
}


@keyframes topBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}

@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
</style>
