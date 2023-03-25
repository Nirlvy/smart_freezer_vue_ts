<template>
  <el-scrollbar>
    <div class="bg">
      <div class="top"><Top /></div>
      <div class="bottom"><Bottom /></div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import Bottom from './components/Bottom.vue'
</script>

<style scoped>
.bg {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  height: 43vh;
  margin-bottom: 10px;
}
</style>
