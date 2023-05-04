<template>
  <div id="lchart2" class="echarts" />
</template>

<script setup lang="ts">
import { useAFreezerStore } from '@/store/store'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption
var chartDom: HTMLCanvasElement

const AFreezerStore = useAFreezerStore()

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = () => {
  if (AFreezerStore.yearUp.length === 0 || AFreezerStore.yearSold.length === 0) {
    setTimeout(() => initEcharts(), 1000)
  } else {
    const result = [] as number[]
    for (let i = 0; i < 12; i++) {
      const dividend = AFreezerStore.yearSold[i]
      const divisor = AFreezerStore.yearUp[i]
      if (divisor === 0) {
        result.push(0)
      } else {
        result.push(Math.floor(dividend / divisor))
      }
    }
    if (chart != undefined) {
      chart.dispose()
    }
    chartDom = document.getElementById('lchart2') as HTMLCanvasElement
    chart = echarts.init(chartDom)
    option = {
      grid: {
        left: '3px',
        right: '3px',
        top: '3px',
        bottom: '3px',
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          data: result,
          type: 'line',
          areaStyle: {},
        },
      ],
    }
    option && chart.setOption(option)
  }
}
</script>

<style scoped>
.echarts {
  height: 100%;
}
</style>
