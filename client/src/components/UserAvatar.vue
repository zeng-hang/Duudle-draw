<template>
  <div
    ref="avatar"
    class="avatar"
    :style="{
          backgroundColor: avatarBgColor
        }"
    @click="changeAvatarBgColor"
  >
    <span>{{ userFirstName }}</span>
  </div>
</template>

<script setup>

defineOptions({
  name: 'UserAvatar',
})

const props = defineProps({
  userName: {
    type: String,
    default: ''
  },
  hasChangeBgColor: {
    type: Boolean,
    default: false
  },
  bgColor: {
    type: String,
    default: ''
  }
})

const genRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

const emits = defineEmits(["update:bgColor"]);
const avatarBgColor = computed({
  get() {
    return props.bgColor || genRandomColor();
  },
  set(val) {
    emits("update:bgColor", val);
  }
});

const changeAvatarBgColor = () => {
  if (!props.hasChangeBgColor) return;
  avatarBgColor.value = genRandomColor();
}

const userFirstName = computed(() => {
  return props.userName[0]?.toUpperCase() || '?'
});

const avatar = ref(null);
onMounted(() => {
  if (!props.bgColor) {
    avatarBgColor.value = genRandomColor();
  }

  avatar.value.style.fontSize = (avatar.value.offsetWidth * 0.46) + 'px';
});


</script>

<style scoped>
.avatar {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  font-size: 1em;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.avatar span {
  mix-blend-mode: difference;
}

</style>
