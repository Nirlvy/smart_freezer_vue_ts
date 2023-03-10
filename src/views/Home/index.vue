<template>
  <el-scrollbar>
    <div class="bg">
      <div class="left">
        <Left />
      </div>
      <div class="right">
        <Right />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import Left from './components/left.vue'
import Right from './components/right.vue'
</script>

<style>
@import url(./index.css);
</style>
