<template>
  <div class="bg">
    <el-row class="fullwidth" :gutter="10">
      <el-col :span="12"><Left class="half" /></el-col>
      <el-col :span="12"><Right class="half" /></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import Left from './components/Left.vue'
import Right from './components/Right.vue'
</script>

<style scoped>
.bg {
  display: flex;
  margin: 0;
}
.half {
  height: 100%;
}
</style>
<style>
.fullwidth {
  width: 100%;
}
.info {
  margin: auto;
}
</style>
