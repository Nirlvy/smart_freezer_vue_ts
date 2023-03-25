<template>
  <div class="title">
    <div>
      <span>资产编码:{{ FreezerStore.chooseRow.name }}</span>
      <!-- <div class="dot"></div> -->
    </div>
    <div>设备配置:{{ FreezerStore.chooseRow.deviceProfileName }}</div>
    <div>MQTT访问令牌:******</div>
  </div>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="数据概览" name="first"><DrawerPageOne /></el-tab-pane>
    <el-tab-pane label="设备管理" name="second"><DrawerPageTwo /></el-tab-pane>
    <el-tab-pane label="商品销售" name="third"><DrawerPageThree /></el-tab-pane>
    <el-tab-pane label="监控告警" name="fourth"><DrawerPageFour /></el-tab-pane>
    <el-tab-pane label="维护报修" name="fifth"><DrawerPageFive /></el-tab-pane>
    <el-tab-pane label="系统设置" name="sixth"><DrawerPageSix /></el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import DrawerPageOne from './components/DrawerPageOne.vue'
import DrawerPageTwo from './components/DrawerPageTwo.vue'
import DrawerPageThree from './components/DrawerPageThree.vue'
import DrawerPageFour from './components/DrawerPageFour.vue'
import DrawerPageFive from './components/DrawerPageFive.vue'
import DrawerPageSix from './components/DrawerPageSix.vue'
import { ref } from 'vue'

const FreezerStore = useFreezerStore()
const activeName = ref('first')

// const getDot = () => {
//   if (!FreezerStore.chooseRow.SHARED_SCOPE) {
//     return 'greenDot'
//   }
//   return FreezerStore.chooseRow.SHARED_SCOPE?.find((item) => item.key === 'active') ? 'green' : 'red'
// }
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  margin-left: 10px;
}
</style>
