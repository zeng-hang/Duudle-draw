<template>
  <div class="z-toast">
    <div class="z-toast__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

defineOptions({
  name: "zToast",
})

</script>

<style scoped>
.z-toast {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.z-toast__content {
  position: relative;
  padding: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}
</style>
