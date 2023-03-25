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
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption
var chartDom: HTMLCanvasElement
const buttonGroup = ref('本月')

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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
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

const button1 = () => {
  option.series = [{ data: [820, 932, 901, 934, 1290, 1330, 1320] }]
  option && chart.setOption(option)
}

const button2 = () => {
  option.series = [{ data: [1, 2, 3, 4, 5, 6, 7] }]
  option && chart.setOption(option)
}
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
