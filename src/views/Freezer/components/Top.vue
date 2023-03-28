<template>
  <el-row :gutter="10" justify="space-between">
    <el-col :span="6">
      <el-tooltip content="点击可切换全部设备|在库设备|在店设备">
        <el-card class="firstCard card" :body-style="cardStyle" @click="firstCardClick">
          <div class="icon">
            <SvgIcon name="freezer" />
          </div>
          <div class="info">
            <div>{{ FreezerStore.freezerCard }}</div>
            <div>{{ cardValue[0].value }}</div>
          </div>
        </el-card>
      </el-tooltip>
    </el-col>
    <el-col v-for="(item, index) in cardValue.slice(1)" :key="index" :span="3">
      <el-card class="card">
        <SvgIcon name="freezer" />
        <div class="info">
          <div>{{ item.name }}</div>
          <div>{{ item.value }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { useFreezerStore } from '@/store/store'
import { find } from '@/utils/commonRequset'

const FreezerStore = useFreezerStore()
const cardValue = ref(FreezerStore.totalFreezer)
const cardStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
}

find(FreezerStore.totalFreezer[0].value, 0, 'PowerOn').then((res) => {
  if (!res) {
    return
  }
  FreezerStore.totalFreezer[6].value = res.totalElements
})

const firstCardClick = () => {
  switch (FreezerStore.freezerCard) {
    case '全部设备':
      FreezerStore.freezerCard = '在库设备'
      break
    case '在库设备':
      FreezerStore.freezerCard = '在店设备'
      break
    case '在店设备':
      FreezerStore.freezerCard = '全部设备'
      break
  }
}
</script>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
