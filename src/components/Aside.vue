<template>
  <el-scrollbar style="height: auto">
    <el-menu
      background-color="#334058"
      text-color="#B5C0D0"
      unique-opened
      :collapse="isCollapse"
      router
      :default-active="curPath"
    >
      <el-menu-item index="/manage/home">
        <el-icon>
          <House />
        </el-icon>
        <span>系统首页</span>
      </el-menu-item>

      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <Box />
          </el-icon>
          <span>管理菜单</span>
        </template>
        <el-menu-item index="2-1">
          <el-icon>
            <Refrigerator />
          </el-icon>
          设备管理
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-icon>
            <Present />
          </el-icon>
          商品管理
        </el-menu-item>
        <el-menu-item index="2-3">
          <el-icon>
            <Files />
          </el-icon>
          库存管理
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <Tickets />
          </el-icon>
          <span>记录菜单</span>
        </template>
        <el-menu-item index="/manage/user">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          用户记录
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
  <div @click="toggleCollapse" style="position: fixed; bottom: 0">
    <el-icon
      style="margin-bottom: 15px; margin-left: 15px"
      :size="30"
      color="white"
    >
      <Fold />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import {
  House,
  Refrigerator,
  Present,
  Box,
  Tickets,
  Fold,
  Files,
  DataAnalysis,
} from "@element-plus/icons-vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"

const isCollapse = ref(false)
const route = useRoute()
const curPath = ref(route.fullPath)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
onBeforeRouteUpdate((to) => {
  curPath.value = to.path
})
</script>

<style scoped>
.layout-container .el-menu {
  border-right: none;
}

span {
  padding-left: 10px;
  padding-right: 20px;
}
</style>
