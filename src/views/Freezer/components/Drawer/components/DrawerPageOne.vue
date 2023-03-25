<template>
  <div class="bg">
    <el-row class="row" :gutter="10">
      <el-col v-for="(item, index) in order" :key="index" :span="12">
        <div :id="item" class="echart" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted } from 'vue'

var chart: echarts.ECharts[] = []
var option: echarts.EChartsOption[] = []
var chartDom: HTMLCanvasElement[] = []

const order = ['first', 'second', 'third', 'fourth', 'fifth']

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = () => {
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
  option = option.map(() => {
    return {
      grid: {
        left: '3px',
        right: '3px',
        top: '0',
        bottom: '0',
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {},
        },
      ],
    }
  })
  option.forEach((item, index) => item && chart[index].setOption(item))
}
</script>

<style scoped>
.bg {
  background-color: #e4e7ed;
  width: 100%;
  height: 75vh;
}
.row {
  width: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
