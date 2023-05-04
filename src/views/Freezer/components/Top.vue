<template>
  <el-row :gutter="10" justify="space-between">
    <el-col :span="6">
      <el-tooltip content="点击可切换全部设备|在库设备|在店设备">
        <el-card class="firstCard card" :body-style="cardStyle" @click="firstCardClick">
          <div class="icon">
            <SvgIcon name="freezer" />
          </div>
          <div class="info">
            <div>{{ FreezerStore.firstCard }}</div>
            <div>{{ FreezerStore.totalFreezer[FreezerStore.firstCard] }}</div>
          </div>
        </el-card>
      </el-tooltip>
    </el-col>
    <el-col v-for="(item, index) in Object.keys(FreezerStore.totalFreezer).slice(1, 7)" :key="index" :span="3">
      <el-card class="card" @click="FreezerStore.freezerCard = item as scopes">
        <el-icon :style="{ 'font-size': '50px', margin: '20px auto', color: color[index] }">
          <component :is="icon[index]" />
        </el-icon>
        <div class="info">
          <div>{{ item }}</div>
          <div>{{ FreezerStore.totalFreezer[item] }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { markRaw } from 'vue'
import { Connection, Link, MagicStick, OfficeBuilding, Open, TurnOff } from '@element-plus/icons-vue'

const FreezerStore = useFreezerStore()
const cardStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
}
const icon = [markRaw(Connection), markRaw(Connection), markRaw(OfficeBuilding), markRaw(Open), markRaw(TurnOff), markRaw(MagicStick)]
const color = ['#6AC373', '#F77A7A', '#BBC3D3', '#6AC373', '#F77A7A', '#3989F5']

const firstCardClick = () => {
  if (FreezerStore.firstCard != FreezerStore.freezerCard) {
    FreezerStore.freezerCard = FreezerStore.firstCard
  } else {
    switch (FreezerStore.firstCard) {
      case '全部设备':
        FreezerStore.firstCard = '在库设备'
        FreezerStore.freezerCard = '在库设备'
        break
      case '在库设备':
        FreezerStore.firstCard = '在店设备'
        FreezerStore.freezerCard = '在店设备'
        break
      case '在店设备':
        FreezerStore.firstCard = '全部设备'
        FreezerStore.freezerCard = '全部设备'
        break
    }
  }
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '@/components/vue/SvgIcon.vue'

export default defineComponent({
  name: 'App',
  components: { SvgIcon },
})
</script>

<style scoped>
.firstCard .icon {
  width: 40%;
  height: 100%;
}
svg {
  width: 100%;
  height: 100%;
}
.firstCard .info {
  width: 80%;
  font-size: x-large;
}
.icon {
  height: 20%;
}
.info {
  font-size: large;
  align-items: center;
  text-align: center;
}
.card {
  height: 196px;
}
</style>
