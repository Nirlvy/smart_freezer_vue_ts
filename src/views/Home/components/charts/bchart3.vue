<template>
  <el-card class="echartCard">
    <div class="echartCardtitle">
      <div class="card-title">销量趋势</div>
      <el-radio-group v-model="buttonGroup">
        <el-radio-button label="本月" @click="button1" />
        <el-radio-button label="本年" @click="button2" />
      </el-radio-group>
    </div>
    <div id="bchart3" class="echarts" />
  </el-card>
</template>

<script setup lang="ts">
import { useAFreezerStore } from '@/store/store'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption
var chartDom: HTMLCanvasElement
const buttonGroup = ref('本月')
const yearSold = ref()
const monSold = ref()
const AFreezerStore = useAFreezerStore()

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = () => {
  buttonGroup.value = '本月'
  if (AFreezerStore.yearSold.length === 0 || AFreezerStore.monthSold.length === 0) {
    setTimeout(() => initEcharts(), 1000)
  } else {
    yearSold.value = AFreezerStore.yearSold
    yearSold.value.length = yearSold.value.length - 1
    monSold.value = AFreezerStore.monthSold
    monSold.value.length = monSold.value.length - 1
    if (chart != undefined) {
      chart.dispose()
    }
    chartDom = document.getElementById('bchart3') as HTMLCanvasElement
    chart = echarts.init(chartDom)
    option = {
      grid: {
        left: '40px',
        right: '10px',
        top: '20px',
        bottom: '20px',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: monSold.value,
          type: 'line',
          areaStyle: {},
        },
      ],
    }
    option && chart.setOption(option)
  }
}

const button1 = () => {
  option.series ? (option.series[0].data = monSold.value) : ''
  option && chart.setOption(option)
}

const button2 = () => {
  option.series ? (option.series[0].data = yearSold.value) : ''
  option && chart.setOption(option)
}
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
