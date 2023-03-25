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
.left {
  width: 80%;
  margin-right: 10px;
}
.right {
  width: 20%;
  display: flex;
  flex-direction: column;
}
.row {
  margin-bottom: 10px;
}
.card-title {
  font-size: large;
  font-weight: bold;
}
.card-value {
  font-size: xx-large;
  margin: 10px 0;
}
.card-text {
  font-size: small;
  display: flex;
  justify-content: space-between;
}
.card-text .value {
  margin: 0 10px;
}
.el-divider--horizontal {
  margin: 5px 0;
}
</style>
