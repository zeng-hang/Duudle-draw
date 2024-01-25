<template>
  <button
    ref="bubbleButton"
    class="bubbly-button"
    :disabled="props.disabled"
    @click="handleBubbleButtonAnimate"
  >
    <slot></slot>
  </button>
</template>

<script setup>

defineOptions({
  name: 'BubbleButton',
})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["click"]);

const bubbleButton = ref(null);
const handleBubbleButtonAnimate = () => {
  bubbleButton.value && bubbleButton.value.classList.remove('animate');
  bubbleButton.value && bubbleButton.value.classList.add('animate');
  setTimeout(() => {
    bubbleButton.value && bubbleButton.value.classList.remove('animate');
  }, 700);

  emits("click");
}

</script>

<style scoped>
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

.bubbly-button:disabled,
.bubbly-button:disabled:active {
  background-color: #ccc;
  color: #fff;
  box-shadow: none;
  cursor: not-allowed;
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
