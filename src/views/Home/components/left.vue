<template>
  <el-row class="row" :gutter="10" justify="space-around">
    <el-col :span="6">
      <el-card>
        <div class="card-title">本月销售额</div>
        <div class="card-value">¥{{ cardValue.monthSold }}</div>
        <div class="blank" />
        <div class="card-text">
          <div>
            <span>月间比</span>
            <span class="value">∞</span>
          </div>
          <div>
            <span>月环比</span>
            <span class="value">{{ Math.abs(cardValue.monthBasis) }}</span>
            <el-icon v-if="cardValue.monthBasis > 0" color="#67C23A"><CaretTop /></el-icon>
            <el-icon v-else color="#F56C6C"><CaretBottom /></el-icon>
          </div>
        </div>
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均销售额</span>
            <span class="value">¥{{ cardValue.dayAveSold }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">月上架数</div>
        <div class="card-value">{{ cardValue.monthUp }}</div>
        <div class="card-chart"><lchart /></div>
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均上架数</span>
            <span class="value">{{ cardValue.dayAveUp }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">年售出率</div>
        <div class="card-value">{{ cardValue.soldRate }}%</div>
        <div class="card-chart"><lchart2 /></div>
        <el-divider />
        <div class="card-text">
          <div>
            <span>月均售出率</span>
            <span class="value">{{ cardValue.monSoldRate }}%</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">月修改商品次数</div>
        <div class="card-value">{{ cardValue.monthAlter }}</div>
        <div class="card-chart"><lchart3 /></div>
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均修改数</span>
            <span class="value">{{ cardValue.dayAlter }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="24">
      <el-card>
        <div class="card-title">快速发起</div>
        <div class="shortCutLine">
          <RouterLink to="/manage/freezer" style="text-decoration: none; color: black">
            <div class="shortCut">
              <Refrigerator />
              <div>设备管理</div>
            </div>
          </RouterLink>
          <RouterLink to="/manage/goods" style="text-decoration: none; color: black">
            <div class="shortCut">
              <Present />
              <div>商品管理</div>
            </div>
          </RouterLink>
          <RouterLink to="/manage/rec" style="text-decoration: none; color: black">
            <div class="shortCut">
              <VideoCamera />
              <div>识别管理</div>
            </div>
          </RouterLink>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="row echartsRow" :gutter="10" justify="space-around">
    <el-col :span="12">
      <bchart />
    </el-col>
    <el-col :span="12">
      <bchart2 />
    </el-col>
  </el-row>
  <el-row class="row echartsRow">
    <el-col :span="24">
      <bchart3 />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Refrigerator, Present, VideoCamera, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import lchart from './charts/lchart.vue'
import lchart2 from './charts/lchart2.vue'
import lchart3 from './charts/lchart3.vue'
import bchart from './charts/bchart.vue'
import bchart2 from './charts/bchart2.vue'
import bchart3 from './charts/bchart3.vue'
import { month, outlets, soldValue, uploadOrSoldDays } from '@/utils/commonRequset2'
import { useAFreezerStore } from '@/store/store'

const AFreezerStore = useAFreezerStore()
const cardValue = reactive({
  monthSold: 0,
  monthRadio: 0,
  monthBasis: 0,
  dayAveSold: 0,
  monthUp: 0,
  dayAveUp: 0,
  soldRate: 0,
  monSoldRate: 0,
  monthAlter: 0,
  dayAlter: 0,
})

const init = async () => {
  const lastMonth = month(true)
  const lastOut = await outlets(1, 10, 'Desc', 'Total Price', lastMonth.startDateTime, lastMonth.endDateTime)
  const thisMonth = month(false)
  const thisOut = await outlets(1, 10, 'Desc', 'Total Price', thisMonth.startDateTime, thisMonth.endDateTime)
  cardValue.monthSold = thisOut[thisOut.length - 1]['Total Price']
  cardValue.monthBasis = Math.floor((thisOut[thisOut.length - 1]['Total Price'] / lastOut[lastOut.length - 1]['Total Price'] - 1) * 100) / 100
  const date = new Date()
  cardValue.dayAveSold = Math.floor((thisOut[thisOut.length - 1]['Total Price'] / date.getDay()) * 100) / 100
  const monthUp = await uploadOrSoldDays('month', true)
  AFreezerStore.monthUp = monthUp
  cardValue.monthUp = monthUp[monthUp.length - 1]
  cardValue.dayAveUp = Math.floor(monthUp[monthUp.length - 1] / date.getDay())
  const yearUp = await uploadOrSoldDays('year', true)
  AFreezerStore.yearUp = yearUp
  const monthSold = await uploadOrSoldDays('month', false)
  AFreezerStore.monthSold = monthSold
  const yearSold = await uploadOrSoldDays('year', false)
  AFreezerStore.yearSold = yearSold
  cardValue.soldRate = Math.floor((yearSold[yearSold.length - 1] / yearUp[yearUp.length - 1]) * 100) / 100
  cardValue.monSoldRate = Math.floor((cardValue.soldRate / (date.getMonth() + 1)) * 100) / 100
  const monthAlter = await uploadOrSoldDays('month', null)
  AFreezerStore.monthAlter = monthAlter
  cardValue.monthAlter = monthAlter[monthAlter.length - 1]
  cardValue.dayAlter = Math.floor(cardValue.monthAlter / date.getDate())
  AFreezerStore.monthSoldValue = await soldValue('month')
  AFreezerStore.yearSoldValue = await soldValue('year')
}
init()
</script>

<style scoped>
.card-chart {
  height: 80.8px;
}
.shortCutLine {
  padding: 5px;
  font-size: small;
  white-space: nowrap;
}
.shortCut {
  margin: 10px 20px 0;
  display: inline-block;
  text-align: center;
}
.echartsRow {
  height: 35vh;
}
.blank {
  height: 60px;
}
</style>

<style>
.echartCard {
  height: 100%;
}
.echartCardtitle {
  display: flex;
  justify-content: space-between;
}
</style>
