<template>
  <el-breadcrumb class="breadcrumb">
    <el-breadcrumb-item class="breadcrumb-item" :to="{ path: '/manage/home' }"> 首页 </el-breadcrumb-item>
    <template v-for="(item, index) in breadList">
      <el-breadcrumb-item v-if="item.name" :key="index" :to="item.path">{{ item.name }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadList = ref(route.matched)
watch(route, () => {
  breadList.value = route.matched
})
</script>

<style scoped>
.breadcrumb {
  background-color: #f3f5f6;
  padding: 10px;
}
</style>
