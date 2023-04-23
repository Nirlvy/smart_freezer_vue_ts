<template>
  <el-drawer v-model="FreezerStore.drawer" title="详情" size="1600px" destroy-on-close>
    <div class="title">
      <div class="line">
        <div>设备编号: {{ FreezerStore.chooseRow.name }}</div>
        <div class="ml-10"><SvgIcon :name="getColorAndState().color" style="height: 10px; width: 10px" /> {{ getColorAndState().state }}</div>
      </div>
      <div>
        设备名称:
        <el-button v-if="!nameSet" type="primary" link @click="nameSet = !nameSet">{{ FreezerStore.chooseRow.deviceName }}­</el-button>
        <span v-else>
          <el-input v-model="FreezerStore.chooseRow.deviceName" style="width: 150px" />
          <el-button class="ml-10" type="primary" @click="nameSave">确定</el-button>
        </span>
      </div>
      <div>设备配置:{{ FreezerStore.chooseRow.deviceProfileName }}</div>
      <div />
    </div>
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="设备管理" name="first" lazy><DrawerPageOne /></el-tab-pane>
      <el-tab-pane label="数据概览" name="second" lazy><DrawerPageTwo /></el-tab-pane>
      <el-tab-pane label="商品销售" name="third" lazy><DrawerPageThree /></el-tab-pane>
      <el-tab-pane label="监控告警" name="fourth" lazy><DrawerPageFour /></el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { useFreezerStore } from '@/store/store'
import DrawerPageOne from './components/DrawerPageOne.vue'
import DrawerPageTwo from './components/DrawerPageTwo.vue'
import DrawerPageThree from './components/DrawerPageThree/index.vue'
import DrawerPageFour from './components/DrawerPageFour.vue'
import { ref, defineComponent } from 'vue'
import { updateDevice } from '@/utils/commonRequset'
import { ElMessage } from 'element-plus'

const FreezerStore = useFreezerStore()
const activeName = ref('first')
const nameSet = ref(false)

const getColorAndState = () => {
  if ('enable' in FreezerStore.chooseRow.SCOPE && 'active' in FreezerStore.chooseRow.SCOPE && FreezerStore.chooseRow.SCOPE.enable) {
    return FreezerStore.chooseRow.SCOPE.active ? { color: 'greenDot', state: '在线' } : { color: 'redDot', state: '离线' }
  }
  return { color: 'grayDot', state: '停用' }
}

const nameSave = () => {
  updateDevice().then((res) => {
    if (res) {
      ElMessage.success('修改成功')
    }
  })
  nameSet.value = false
}
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
</style>
