<template>
  <el-scrollbar style="height: auto">
    <el-menu
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
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <Box />
          </el-icon>
          <span>管理菜单</span>
        </template>
        <el-menu-item index="/manage/freezer">
          <el-icon>
            <Refrigerator />
          </el-icon>
          设备管理
        </el-menu-item>
        <el-menu-item index="/manage/goods">
          <el-icon>
            <Present />
          </el-icon>
          商品管理
        </el-menu-item>
        <el-menu-item index="/manage/role">
          <el-icon>
            <Files />
          </el-icon>
          管理控制
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
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
  <div style="position: fixed; bottom: 0" @click="isCollapse = !isCollapse">
    <el-icon style="margin-bottom: 15px; margin-left: 15px" :size="30">
      <Fold />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  House,
  Refrigerator,
  Present,
  Box,
  Tickets,
  Fold,
  Files,
  DataAnalysis,
} from '@element-plus/icons-vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const isCollapse = ref(false)
const route = useRoute()
const curPath = ref(route.fullPath)

onBeforeRouteUpdate((to, _from, next) => {
  curPath.value = to.path
  next()
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
