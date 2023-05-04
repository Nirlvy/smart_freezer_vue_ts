<template>
  <el-card class="echartCard">
    <div class="echartCardtitle">
      <div class="card-title">销量类别占比</div>
      <el-radio-group v-model="buttonGroup">
        <el-radio-button label="本月" @click="button1" />
        <el-radio-button label="本年" @click="button2" />
      </el-radio-group>
    </div>
    <div id="bchart2" class="echarts" />
  </el-card>
</template>

<script setup lang="ts">
import { productPage } from '@/utils/commonRequset2'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption
var chartDom: HTMLCanvasElement
const buttonGroup = ref('本月')
const month = ref()
const year = ref()

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = async () => {
  buttonGroup.value = '本月'
  if (!month.value) {
    month.value = await productPage('month')
    year.value = await productPage('year')
  }
  if (chart != undefined) {
    chart.dispose()
  }
  chartDom = document.getElementById('bchart2') as HTMLCanvasElement
  chart = echarts.init(chartDom)
  option = {
    grid: {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: '15%',
      right: '5%',
    },
    series: [
      {
        name: '销量类别占比',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b} : {c} ({d}%)',
        },
        data: month.value,
      },
    ],
  }
  option && chart.setOption(option)
}

const button1 = () => {
  option.series ? (option.series[0].data = month.value) : ''
  option && chart.setOption(option)
}

const button2 = () => {
  option.series ? (option.series[0].data = year.value) : ''
  option && chart.setOption(option)
}
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
