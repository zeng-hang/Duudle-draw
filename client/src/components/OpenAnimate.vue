<template>
  <div class="container">
   <slot></slot>

    <div :class="{
      'open-mask': true,
      'open': props.open
    }">
      <div class="open-content">
        <slot name="open-word"></slot>
      </div>
    </div>

  </div>
</template>

<script setup>

defineOptions({
  name: "OpenAnimate",
})

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

.open-mask {
  position: absolute;
  top: -50%;
  left: -50%;
  height: 200%;
  width: 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  visibility: hidden;
  z-index: 2;
  transform: rotate(-15deg) translate3d(0, 0, 0);
}

.open-mask::before,
.open-mask::after {
  display: block;
  content: "";
  position: absolute;
  left: 50%;
  width: 100%;
  height: 80%;
  background-color: #2196F3;
  transform-origin: center center;
  transition: all 500ms ease;
  will-change: transform;
  z-index: -1;
}

.open-mask::before {
  top: 51%;
  transform: translate(100%, -100%) translate3d(0, 0, 0);
}

.open-mask::after {
  top: 49%;
  transform: translate(-150%, 0%) translate3d(0, 0, 0);
  transition-delay: 100ms;
}

.open-mask .open-content {
  position: relative;
  display: inline-block;
  transform: rotate(15deg);
  color: #000;
  width: 100%;
  background: #fff;
  text-align: center;
}


.open-mask.open {
  visibility: visible;
}

.open-mask.open::before {
  animation: menu-in-left 500ms ease;
  transform: translate(-50%, -100%) translate3d(0, 0, 0);
  transition-duration: 0ms;
}

.open-mask.open::after {
  animation: menu-in-right 500ms ease 100ms;
  transform: translate(-50%, 0%) translate3d(0, 0, 0);
  transition-duration: 0ms;
}

.open-mask.open .open-content {
  opacity: 1;
  transform: translateX(0px) translate3d(0, 0, 0);
  transition: all 250ms ease;
  transition-delay: 250ms;
}


@keyframes menu-in-left {
  0% {
    transform: translate(-150%, -100%) translate3d(0, 0, 0);
  }
  100% {
    transform: translate(-50%, -100%) translate3d(0, 0, 0);
  }
}

@keyframes menu-in-right {
  0% {
    transform: translate(100%, 0%) translate3d(0, 0, 0);
  }
  100% {
    transform: translate(-50%, 0%) translate3d(0, 0, 0);
  }
}

.btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: white;
  color: #0e0c0e;
  text-align: center;
  font-size: 10px;
  font-weight: 900;
  line-height: 40px;
  cursor: pointer;
  user-select: none;
  z-index: 3;
}

</style>
