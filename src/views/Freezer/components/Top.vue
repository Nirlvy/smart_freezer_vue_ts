<template>
  <el-row :gutter="10" justify="space-between">
    <el-col :span="6">
      <el-card class="firstCard card" :body-style="cardStyle">
        <div class="icon">
          <SvgIcon name="freezer" />
        </div>
        <div class="info">
          <div>{{ cardValue[0].name }}</div>
          <div>{{ cardValue[0].value }}</div>
        </div>
      </el-card>
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
const FreezerStore = useFreezerStore()
const cardValue = FreezerStore.cardValue
const cardStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'
import { useFreezerStore } from '@/store/store'
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
