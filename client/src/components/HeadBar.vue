<template>
  <div class="header">
    <div class="title-wrap">
      <h1 class="colorful-title">{{ props.title }}</h1>
      <span v-if="props.description" class="description">{{ props.description }}</span>
    </div>
    <user-avatar
      @click="() => $router.push('/profile')"
      style="margin-left: auto; margin-right: 20px;"
      :bg-color="props.userInfo.avatarBgColor"
      :user-name="props.userInfo.userName"
    />
  </div>
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";

defineOptions({
  name: 'HeadBar',
})

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

</script>

<style scoped>

.header {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.title-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.colorful-title {
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 700;
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

.description {
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: #000;
}
</style>
