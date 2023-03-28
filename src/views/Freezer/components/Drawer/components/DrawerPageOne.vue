<template>
  <div class="bg">
    <el-row class="row" :gutter="5">
      <el-col v-for="(item, index) in order" :key="index" :span="12" class="col">
        <el-card class="card"><div :id="item" class="echart" /></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { getDeviceCharts, getTime } from '@/utils/commonRequset'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted } from 'vue'

var chart: echarts.ECharts[] = []
var option: echarts.EChartsOption[] = []
var chartDom: HTMLCanvasElement[] = []

const order = ['first', 'second', 'third', 'fourth']
const FreezerStore = useFreezerStore()

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  setTimeout(() => initEcharts(), 1)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = async () => {
  const nowts = new Date().getTime()
  const yests = nowts - 100 * 60 * 1000
  const ts = [yests, nowts]
  let date: string[] = []
  for (i = yests; i <= nowts; i += 60 * 1000) {
    date.push(getTime(i))
  }
  const res = await getDeviceCharts(FreezerStore.chooseRow.id.id, ts)
  if (!res) {
    return
  }
  const title = ['人客流量', '开门次数', '柜内温度', '电压']
  const param = ['base.core.popu.cnt', 'base.core.door.cnt', 'base.core.frhCtrl.temp.val', 'base.core.power.u']
  if (chart != undefined) {
    chart.forEach((item) => {
      item.dispose()
    })
    chart.length = 0
    option.length = 0
    chartDom.length = 0
  }
  order.forEach((item) => chartDom.push(document.getElementById(item) as HTMLCanvasElement))
  chartDom.forEach((item) => chart.push(echarts.init(item)))
  for (var i = 0; i < 4; i++) {
    option[i] = {
      title: {
        text: title[i],
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '60',
        right: '50',
        top: '40',
        bottom: '20',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: title[i],
          data: res
            .filter((obj): obj is chart & E => Boolean(obj))
            .filter((obj) => Object.keys(obj)[0] === param[i])
            .map((obj) => obj[param[i]])
            .flat()
            .map((item) => item.value),
          type: 'line',
        },
      ],
    }
  }
  option.forEach((item, index) => item && chart[index].setOption(item))
}
</script>

<style scoped>
.bg {
  background-color: #f9faff;
  width: 100%;
  height: 70vh;
  margin: 0;
  padding: 5px;
}
.row {
  width: 100%;
}
.col {
  height: 50%;
}
.card {
  width: 100%;
  height: 100%;
}
.echart {
  flex: 1;
}
</style>
