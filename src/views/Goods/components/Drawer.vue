<template>
  <el-drawer v-model="itemStore.drawer" title="展示列选择" size="400">
    <el-menu :default-openeds="openeds">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>固定左侧</span>
        </template>
        <el-menu-item disabled>资产编码</el-menu-item>
        <el-menu-item disabled>开门时间</el-menu-item>
        <el-menu-item disabled>关门时间</el-menu-item>
        <el-menu-item disabled>购物编码</el-menu-item>
        <el-menu-item disabled>商品信息</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>不固定</span>
        </template>
        <el-menu-item v-for="(item, index) in itemStore.items" :key="item.label" class="menu">
          <div class="menuItem">
            <el-checkbox v-model="item.checked" />
            <span class="ml-5">{{ item.label }}</span>
          </div>
          <div class="menuItem menuButton">
            <el-button text circle :disabled="index === 0" @click="moveUp(index)">
              <el-icon style="color: #409efc">
                <Upload />
              </el-icon>
            </el-button>
            <el-button text circle :disabled="index === 3" @click="moveDown(index)">
              <el-icon style="color: #409efc">
                <Download />
              </el-icon>
            </el-button>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-drawer>
</template>

<script setup lang="ts">
import { useItemStore } from '@/store/store'
import { Setting, Upload, Download } from '@element-plus/icons-vue'

const itemStore = useItemStore()
const openeds = ['1', '2']

const moveUp = (index: number) => {
  ;[itemStore.items[index], itemStore.items[index - 1]] = [itemStore.items[index - 1], itemStore.items[index]]
}

const moveDown = (index: number) => {
  ;[itemStore.items[index], itemStore.items[index + 1]] = [itemStore.items[index + 1], itemStore.items[index]]
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
}
.menuItem {
  display: flex;
  align-items: center;
}
.menuButton {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}
.menu:hover .menuButton {
  opacity: 1;
}
</style>
