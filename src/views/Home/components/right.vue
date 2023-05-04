<template>
  <el-card class="firstCard row">
    <div class="card-title">信息</div>
    <el-row :gutter="5">
      <el-col :span="8">
        <div class="tone">
          <el-icon :size="52" color="#FE7179">
            <Refrigerator />
          </el-icon>
          <div class="card-text">全部设备</div>
          <div class="card-text">{{ FreezerStore.totalFreezer['全部设备'] }}</div>
        </div>
      </el-col>
      <el-col v-for="(item, index) in Object.keys(FreezerStore.totalFreezer).slice(1)" :key="index" :span="8">
        <div class="tone">
          <el-progress
            type="circle"
            :percentage="
              Math.floor((FreezerStore.totalFreezer[item] * 100) / FreezerStore.totalFreezer['全部设备'])
                ? Math.floor((FreezerStore.totalFreezer[item] * 100) / FreezerStore.totalFreezer['全部设备'])
                : 0
            "
            :width="52"
            :color="colors"
          />
          <div class="card-text">{{ item }}</div>
          <div class="card-text">{{ FreezerStore.totalFreezer[item] }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="secondCard row">
    <div class="card-title">代办中心</div>
    <ul>
      <li v-for="(item, index) in centerList" :key="index">
        <span>{{ item.name }}</span>
        <span class="value">{{ item.value }}</span>
      </li>
    </ul>
  </el-card>
  <el-card class="thirdCard row">
    <div class="card-title">帮助中心</div>
    <div v-for="(item, index) in helpList" :key="index" class="card-line">
      <span>
        <el-icon class="helpIcon">
          <component :is="item.icon" />
        </el-icon>
        {{ item.name }}
      </span>
      <span>
        <el-icon><ArrowRightBold /></el-icon>
      </span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import { useFreezerStore, useMainStore } from '@/store/store'
import { ChatRound, ArrowRightBold, Refrigerator } from '@element-plus/icons-vue'
import { markRaw, reactive } from 'vue'

const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
const centerList = reactive([
  { name: '仓库代办', value: 0 },
  { name: '生产代办', value: 0 },
  { name: '采购代办', value: 0 },
  { name: '销售代办', value: 0 },
])
const helpList = reactive([
  { icon: markRaw(ChatRound), name: '新手帮助' },
  { icon: markRaw(ChatRound), name: '在线帮助' },
  { icon: markRaw(ChatRound), name: '视频教程' },
  { icon: markRaw(ChatRound), name: '流程图' },
])
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const init = async () => {
  await request.get<USER & E>('/user/' + MainStore.Jwt.userId).then((res) => {
    if (res.data.status) {
      return
    }
    MainStore.User = res.data
  })
}
init()
</script>

<style scoped>
.firstCard {
  height: 254.58px;
}
.secondCard,
.thirdCard {
  flex: 1;
}
.tone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
}
ul {
  margin: 10px -10px;
}
li {
  margin-bottom: 20px;
}
.value {
  float: right;
  margin-right: 10%;
}
.card-line {
  display: flex;
  justify-content: space-between;
  margin: 10px 5px;
}
.helpIcon {
  margin-right: 10px;
}
</style>
