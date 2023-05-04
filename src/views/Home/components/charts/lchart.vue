<template>
  <div id="lchart" class="echarts" />
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
  let monthUp = AFreezerStore.monthUp
  if (AFreezerStore.monthUp.length === 0) {
    setTimeout(() => initEcharts(), 1000)
  } else {
    monthUp.length = monthUp.length - 1
    if (chart != undefined) {
      chart.dispose()
    }
    chartDom = document.getElementById('lchart') as HTMLCanvasElement
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
          data: monthUp,
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
