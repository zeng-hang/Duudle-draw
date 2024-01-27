<template>
  <div class="flex-container">

    <div class="draw-container">
      <div class="topic">
        两个字，是一种动物，四只脚
      </div>

      <div style="position: relative">
        <canvas id="drawBoard"></canvas>

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
            <span class="message">{{ item.message }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="self.userName === currentAuditor"
        class="tools-box"
      >
        <div class="painting-brush-container">
          <div
            v-for="(brush, index) in paintingBrushes"
            :class="{
              'painting-brush': true,
              active: currentBrush === index
            }"
            @click="handleChooseBrush(index)"
          >
            <img :alt="brush.name" :src="brush.icon">
            <span>{{ brush.name }}</span>
          </div>
        </div>

        <div class="colorful">
          <div
            v-for="color in colorFul"
            :key="color"
            :class="{
                color: true,
                active: color === currentColor
              }"
            :style="{backgroundColor: color}"
            @click="handleChooseColor(color)"
          ></div>
        </div>
      </div>

      <div v-else class="answer-area">
        <input
          v-model="answer"
          placeholder="请输入答案"
          maxlength="10"
          @keyup.enter="handleAnswer"
          :disabled="self.score > 0"
        >
        <button
          @click="handleAnswer"
          :disabled="self.score > 0"
        >
          确认
        </button>
      </div>
    </div>

    <div class="preparative">
      <div
        v-for="item in preparative"
        :key="item.userName"
        class="user-info"
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
            active: item.userName === currentAuditor
          }"
          style="width: 40px; height: 40px;"
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
      class="preparative"
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

    <h3 class="divide-title">本场作品</h3>

    <div class="portfolio">
      <div class="opus" v-for="i in 10" :key="i">
        <img alt="opus" src="@/assets/vue.svg">
        <span>作品名称</span>
        <span>作者：小明</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fabric } from "fabric";
import UserAvatar from "@/components/UserAvatar.vue";
import { getUserInfo } from "@/store/localforage.js";
import huabi_1 from '@/assets/icon/huabi_1.svg';
import huabi_2 from '@/assets/icon/huabi_2.svg';
import huabi_3 from '@/assets/icon/huabi_3.svg';
import huabi_4 from '@/assets/icon/huabi_4.svg';
import beijingyanse from '@/assets/icon/beijingyanse.svg';
import chexiao from '@/assets/icon/chexiao.svg';
import qingkong from '@/assets/icon/qingkong.svg';

defineOptions({
  name: 'Game',
});

const drawStack = [];
let canvas = null;
onMounted(() => {

  canvas = new fabric.Canvas('drawBoard', {
    width: 360,
    height: 360,
    isDrawingMode: true
  });

  // const targetCanvas = new fabric.Canvas('targetCanvas', {
  //   width: 300,
  //   height: 300,
  //   isDrawingMode: true
  // });

  canvas.freeDrawingBrush.width = brushWidths[currentBrush.value];
  canvas.freeDrawingBrush.color = currentColor.value;

  canvas.on('path:created', function (e) {
    drawStack.push(e.path);
  });


  // const pencil = new fabric.PencilBrush(targetCanvas);
  // pencil.color = '#0000ff';
  // pencil.width = 5;
  // targetCanvas.freeDrawingBrush = pencil;
  //
  // canvas.on('mouse:down', function (e) {
  //   const pointer = canvas.getPointer(e.e);
  //   pencil.onMouseDown(pointer ,{e:{}, pointer});
  // });
  //
  // canvas.on('mouse:move', function (e) {
  //   const pointer = canvas.getPointer(e.e);
  //   pencil.onMouseMove(pointer ,{e: {}, pointer});
  // });
  //
  // canvas.on('mouse:up', function (e) {
  //   const pointer = canvas.getPointer(e.e);
  //   pencil.onMouseUp({e: {}, pointer});
  // });
});

const currentColor = ref('#000000');
const colorFul = [
  '#000000',
  '#FFFFFF',
  '#808080',
  '#ADD8E6',
  '#FF0000',
  '#FF69B4',
  '#FFC0CB',
  '#FFA500',
  '#FFFF00',
  '#FFFFE0',
  '#008000',
  '#00FF00',
  '#2196F3',
  '#00FFFF',
  '#800080',
  '#A52A2A'
];
const handleChooseColor = (color) => {
  if (currentBrush.value === 4) {
    drawStack.push({
      color,
      previousColor: canvas.backgroundColor,
      type: 'background',
    });
    canvas.backgroundColor = color;
    canvas.renderAll();
    return;
  }

  currentColor.value = color;
  canvas.freeDrawingBrush.color = color;
};

const paintingBrushes = [
  { name: '1号画笔', icon: huabi_1 }, // 0
  { name: '2号画笔', icon: huabi_2 }, // 1
  { name: '3号画笔', icon: huabi_3 }, // 2
  { name: '4号画笔', icon: huabi_4 }, // 3
  { name: '背景颜色', icon: beijingyanse }, // 4
  { name: '撤销', icon: chexiao }, // 5
  { name: '清空', icon: qingkong }, // 6
];
const currentBrush = ref(1);
const brushWidths = [2, 5, 10, 20];
const handleChooseBrush = (brush) => {
  if (brush === 6) {
    window.confirm('确定要清空画板吗？') && canvas.clear();
    return;
  }

  if (brush === 5) {
    const lastPath = drawStack.pop();
    if (!lastPath) {
      return;
    }

    if (lastPath.type === 'background') {
      canvas.backgroundColor = lastPath.previousColor;
      canvas.renderAll();
      return;
    }
    canvas.remove(lastPath);
    return;
  }

  currentBrush.value = brush;
  if (brush === 4) {
    return;
  }

  canvas.freeDrawingBrush.width = brushWidths[brush];
};

const self = ref({});
getUserInfo().then((res) => {
  self.value = res;
  preparative.value.unshift(res);
});

const preparative = ref([
  { userName: '小明', avatarBgColor: '#FF0000', score: 3 },
  { userName: '小红', avatarBgColor: '#FF69B4' },
  { userName: '小刚', avatarBgColor: '#FFC0CB' },
  { userName: '小李', avatarBgColor: '#FFA500' },
  { userName: '小王', avatarBgColor: '#FFFF00' },
]);
const currentAuditor = ref('我叫哈哈哈');

const MESSAGE_TYPES = {
  TEXT: 1,
  SUCCESS: 2,
}
const answer = ref('');
const handleAnswer = () => {
  if (!answer.value) {
    return;
  }

  handleAddBarrageMessage({
    userName: '小明',
    message: answer.value,
    messageType: MESSAGE_TYPES.TEXT,
  });
  answer.value = '';
};

//  弹幕消息
const barrageMessageList = ref([]);
const handleAddBarrageMessage = (message) => {
  const user = preparative.value.find((item) => item.userName === message.userName);
  message.id = genUUID();
  message.avatarBgColor = user.avatarBgColor;
  barrageMessageList.value.push(message);

  nextTick(() => {
    const barrageMessage = document.querySelector('.barrage-message');
    barrageMessage.scroll({
      top: barrageMessage.scrollHeight,
      behavior: 'smooth',
    })
  });
};

const genUUID = () => {
  return Math.random().toString(36).substr(2);
};

const audience = ref([
  { userName: '小明', avatarBgColor: '#FF0000', message: '这是正确答案这是正确答案' },
  { userName: '小红', avatarBgColor: '#FF69B4', message: '1' },
  { userName: '小刚', avatarBgColor: '#FFC0CB' },
  { userName: '小李', avatarBgColor: '#FFA500' },
  { userName: '小王', avatarBgColor: '#FFFF00' },
  { userName: '小明', avatarBgColor: '#FF0000' },
  { userName: '小红', avatarBgColor: '#FF69B4' },
  { userName: '小刚', avatarBgColor: '#FFC0CB' },
  { userName: '小李', avatarBgColor: '#FFA500' },
  { userName: '小王', avatarBgColor: '#FFFF00' },
  { userName: '小明', avatarBgColor: '#FF0000' },
  { userName: '小红', avatarBgColor: '#FF69B4' },
  { userName: '小刚', avatarBgColor: '#FFC0CB' },
  { userName: '小李', avatarBgColor: '#FFA500' },
  { userName: '小王', avatarBgColor: '#FFFF00' },
  { userName: '小明', avatarBgColor: '#FF0000' },
  { userName: '小红', avatarBgColor: '#FF69B4' },
  { userName: '小刚', avatarBgColor: '#FFC0CB' },
  { userName: '小李', avatarBgColor: '#FFA500' },
  { userName: '小王', avatarBgColor: '#FFFF00' },
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
.flex-container {
  --layout-width: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 10px;
}

.draw-container {
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

#drawBoard {
  width: var(--layout-width);
  height: var(--layout-width);
}

.painting-brush-container {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  padding: 4px 0;
}

.painting-brush {
  flex: 0 0 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40px;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
}

.painting-brush img {
  width: 20px;
  height: 20px;
}

.painting-brush span {
  font-size: 12px;
  white-space: nowrap;
  transform: scale(0.8);
}

@media (hover: hover) {
  .painting-brush:hover {
    box-shadow: 0 0 0 1px #2196F3;
  }
}

.painting-brush.active,
.painting-brush:active {
  box-shadow: 0 0 0 1px #2196F3;
}

.colorful {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
}

.colorful .color {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
}

@media (hover: hover) {
  .colorful .color:hover {
    box-shadow: 0 0 0 1px #2196F3, 0 0 2px 2px #4FC3F7;
  }
}

.colorful .color:active,
.colorful .color.active {
  box-shadow: 0 0 0 1px #2196F3, 0 0 2px 2px #4FC3F7;
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

.preparative {
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
