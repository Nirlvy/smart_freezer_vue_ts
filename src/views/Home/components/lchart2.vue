<template>
  <div id="lchart2" class="echarts" />
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption
var chartDom: HTMLCanvasElement

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = () => {
  if (chart != undefined) {
    chart.dispose()
  }
  chartDom = document.getElementById('lchart2') as HTMLCanvasElement
  chart = echarts.init(chartDom)
  option = {
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
  option && chart.setOption(option)
}
</script>

<style scoped>
.echarts {
  height: 100%;
}
</style>
