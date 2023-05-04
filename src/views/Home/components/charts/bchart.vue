<template>
  <el-card class="echartCard">
    <div class="echartCardtitle">
      <div class="card-title">销售</div>
      <el-radio-group v-model="buttonGroup">
        <el-radio-button label="本月" @click="button1" />
        <el-radio-button label="本年" @click="button2" />
      </el-radio-group>
    </div>
    <div id="bchart" class="echarts" />
  </el-card>
</template>

<script setup lang="ts">
import { useAFreezerStore } from '@/store/store'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

var chart: echarts.ECharts
var option: echarts.EChartsOption
var chartDom: HTMLCanvasElement
const buttonGroup = ref('本月')
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
  if (AFreezerStore.monthSoldValue.length === 0 || AFreezerStore.yearSoldValue.length === 0) {
    setTimeout(() => initEcharts(), 1000)
  } else {
    if (chart != undefined) {
      chart.dispose()
    }
    chartDom = document.getElementById('bchart') as HTMLCanvasElement
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
          data: AFreezerStore.monthSoldValue,
          type: 'line',
          areaStyle: {},
        },
      ],
    }
    option && chart.setOption(option)
  }
}

const button1 = () => {
  option.series = [{ data: AFreezerStore.monthSoldValue }]
  option && chart.setOption(option)
}

const button2 = () => {
  option.series = [{ data: AFreezerStore.yearSoldValue }]
  option && chart.setOption(option)
}
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
