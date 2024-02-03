<template>
  <div>
    <div style="position: relative">
      <canvas id="drawBoard"></canvas>
      <slot></slot>
    </div>

    <div v-if="props.hasDraw" class="tools-box">
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
  </div>
</template>

<script setup>
import huabi_1 from "@/assets/icon/huabi_1.svg";
import huabi_2 from "@/assets/icon/huabi_2.svg";
import huabi_3 from "@/assets/icon/huabi_3.svg";
import huabi_4 from "@/assets/icon/huabi_4.svg";
import beijingyanse from "@/assets/icon/beijingyanse.svg";
import chexiao from "@/assets/icon/chexiao.svg";
import qingkong from "@/assets/icon/qingkong.svg";
import socket, {emitSocket, useSocketOn} from "@/utils/socketIo.js";
import {fabric} from "fabric";

defineOptions({
  name: "DrawBoard"
})

const props = defineProps({
  hasDraw: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['sync']);

const handleBgColor = (color) => {
  drawStack.push({
    color,
    previousColor: canvas.backgroundColor,
    type: 'background',
  });
  canvas.backgroundColor = color;
  canvas.renderAll();
}

const handleBrushColor = (color) => {
  currentColor.value = color;
  canvas.freeDrawingBrush.color = color;
  // canvas.freeDrawingBrush.shadow.color = shadowColors[color];
}

const handleClear = () => {
  canvas.clear();
  drawStack.push({
    type: 'clear',
  });
}

const handleUndo = () => {
  const lastPath = drawStack.pop();
  if (!lastPath) {
    return;
  }

  if (lastPath.type === 'background') {
    canvas.backgroundColor = lastPath.previousColor;
    canvas.renderAll();
    return;
  }

  if (lastPath.type === 'clear') {
    for (const path of drawStack) {
      if (path.type !== 'background') {
        canvas.add(path);
      } else {
        canvas.backgroundColor = path.color;
      }
    }
    return;
  }

  canvas.remove(lastPath);
}

const handleBrush = (brush) => {
  canvas.freeDrawingBrush.width = brushWidths[brush];
}

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
const shadowColors = {
  '#000000': '#666666',
  '#FFFFFF': '#DDDDDD',
  '#808080': '#B0B0B0',
  '#ADD8E6': '#D0E6F5',
  '#FF0000': '#FF6666',
  '#FF69B4': '#FFB6C1',
  '#FFC0CB': '#FFD1DC',
  '#FFA500': '#FFD180',
  '#FFFF00': '#FFFF80',
  '#FFFFE0': '#FFFFF0',
  '#008000': '#00A000',
  '#00FF00': '#80FF80',
  '#2196F3': '#4FC3F7',
  '#00FFFF': '#80FFFF',
  '#800080': '#A040A0',
  '#A52A2A': '#D46A6A',
}
const handleChooseColor = (color) => {
  if (currentBrush.value === 4) {
    handleBgColor(color);
    emitSocket('bg', color);
    currentBrush.value = brushWidths.findIndex((item) => item === canvas.freeDrawingBrush.width);
    return;
  }

  handleBrushColor(color);
  emitSocket('color', color);
};

const paintingBrushes = [
  {name: '1号画笔', icon: huabi_1}, // 0
  {name: '2号画笔', icon: huabi_2}, // 1
  {name: '3号画笔', icon: huabi_3}, // 2
  {name: '4号画笔', icon: huabi_4}, // 3
  {name: '背景颜色', icon: beijingyanse}, // 4
  {name: '撤销', icon: chexiao}, // 5
  {name: '清空', icon: qingkong}, // 6
];
const currentBrush = ref(1);
const brushWidths = [2, 5, 10, 20];
const handleChooseBrush = (brush) => {
  if (brush === 6) {
    if (window.confirm('确定要清空画板吗？')) {
      handleClear();
      emitSocket('clear', null);
    }
    return;
  }

  if (brush === 5) {
    emitSocket('undo', null);
    handleUndo();
    return;
  }

  currentBrush.value = brush;
  if (brush === 4) {
    return;
  }

  handleBrush(brush);
  emitSocket('brush', brush);
};

useSocketOn('bg', handleBgColor);
useSocketOn('color', handleBrushColor);
useSocketOn('clear', handleClear);
useSocketOn('undo', handleUndo);
useSocketOn('brush', handleBrush);


const drawStack = [];
drawStack.push = function (item) {
  const res = Array.prototype.push.call(this, item);
  if (!props.hasDraw) {
    return res;
  }

  let data = item
  if (item.type === 'path') {
    item.includeDefaultValues = false;
    data = item.toJSON();
  }
  emitSocket('pushDrawStack', data);
  return res;
};
drawStack.pop = function () {
  const res = Array.prototype.pop.call(this);
  if (!props.hasDraw) {
    return res;
  }

  emitSocket('popDrawStack');
  return res;
};

let canvas = null;
onMounted(() => {
  canvas = new fabric.Canvas('drawBoard', {
    width: 360,
    height: 360,
    isDrawingMode: false
  });
  canvas.selection = false;
  canvas.includeDefaultValues = false;

  canvas.on('path:created', function (e) {
    e.path.set('selectable', false);
    drawStack.push(e.path);
  });
  emitSocket('sync', null);
  socket.once('sync', (data) => {
    for (const path of data) {
      if (path.type !== 'background') {
        const obj = new fabric.Path(path.path, path);
        obj.set('selectable', false);
        canvas.add(obj);
        drawStack.push(obj);
      } else {
        canvas.backgroundColor = path.color;
        drawStack.push(path);
      }
    }

    const lastPath = drawStack.findLast((item) => item.type !== 'background');
    if (lastPath) {
      canvas.freeDrawingBrush.color = lastPath.stroke;
      canvas.freeDrawingBrush.width = lastPath.strokeWidth;
    }
    canvas.renderAll();
    emits('sync');
  });

  const pencil = new fabric.PencilBrush(canvas);
  pencil.color = currentColor.value;
  pencil.width = brushWidths[currentBrush.value];
  canvas.freeDrawingBrush = pencil;

  // pencil.shadow = new fabric.Shadow({
  //   blur: 2,
  //   offsetX: 0,
  //   offsetY: 0,
  //   affectStroke: true,
  //   color: "#ff0000",
  // });

  let isDrawing = false;
  canvas.on('mouse:down', function (e) {
    if (props.hasDraw) {
      isDrawing = true;
      const pointer = canvas.getPointer(e.e);
      pencil.onMouseDown(pointer, {e: {}, pointer});
      emitSocket('md', pointer);
    }
  });

  canvas.on('mouse:move', function (e) {
    if (props.hasDraw && isDrawing) {
      const pointer = canvas.getPointer(e.e);
      pencil.onMouseMove(pointer, {e: {}, pointer});
      emitSocket('mm', pointer);
    }
  });

  canvas.on('mouse:up', function (e) {
    if (props.hasDraw && isDrawing) {
      isDrawing = false;
      const pointer = canvas.getPointer(e.e);
      pencil.onMouseUp({e: {}, pointer});
      emitSocket('mu', pointer);
    }
  });

  useSocketOn('md', (pointer) => {
    pencil.onMouseDown(pointer, {e: {}, pointer});
  });

  useSocketOn('mm', (pointer) => {
    pencil.onMouseMove(pointer, {e: {}, pointer});
  });

  useSocketOn('mu', (pointer) => {
    pencil.onMouseUp({e: {}, pointer});
  });
});
</script>

<style scoped>

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
</style>
