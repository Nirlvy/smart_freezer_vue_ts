<template>
  <el-drawer v-model="FreezerStore.drawer" title="详情" size="50%" destroy-on-close>
    <div class="title">
      <div class="line">
        <div>资产编码: {{ FreezerStore.chooseRow.name }}</div>
        <div v-if="FreezerStore.chooseRow.SCOPE?.find((item) => item.key === 'enable')?.value" class="iconLine ml-10">
          <SvgIcon name="greenDot" style="height: 10px; width: 10px" /> 在线
        </div>
        <div v-else class="iconLine ml-10"><SvgIcon name="grayDot" style="height: 10px; width: 10px" /> 离线</div>
      </div>
      <div>设备配置:{{ FreezerStore.chooseRow.deviceProfileName }}</div>
      <div />
    </div>
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="数据概览" name="first" lazy><DrawerPageOne /></el-tab-pane>
      <el-tab-pane label="设备管理" name="second" lazy><DrawerPageTwo /></el-tab-pane>
      <el-tab-pane label="商品销售" name="third" lazy><DrawerPageThree /></el-tab-pane>
      <el-tab-pane label="监控告警" name="fourth" lazy><DrawerPageFour /></el-tab-pane>
      <el-tab-pane label="维护报修" name="fifth" lazy><DrawerPageFive /></el-tab-pane>
      <el-tab-pane label="系统设置" name="sixth" lazy><DrawerPageSix /></el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { useFreezerStore } from '@/store/store'
import DrawerPageOne from './components/DrawerPageOne.vue'
import DrawerPageTwo from './components/DrawerPageTwo.vue'
import DrawerPageThree from './components/DrawerPageThree.vue'
import DrawerPageFour from './components/DrawerPageFour.vue'
import DrawerPageFive from './components/DrawerPageFive.vue'
import DrawerPageSix from './components/DrawerPageSix.vue'
import { ref, defineComponent } from 'vue'

const FreezerStore = useFreezerStore()
const activeName = ref('first')

// const getDot = () => {
//   if (!FreezerStore.chooseRow.SHARED_SCOPE) {
//     return 'greenDot'
//   }
//   return FreezerStore.chooseRow.SHARED_SCOPE?.find((item) => item.key === 'active') ? 'green' : 'red'
// }
</script>

<script lang="ts">
export default defineComponent({
  name: 'App',
  components: { SvgIcon },
})
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: larger;
}
.line {
  display: flex;
}
.iconLine {
  display: flex;
  align-items: center;
}
</style>
