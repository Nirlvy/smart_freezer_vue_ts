<template>
  <el-card class="echartCard">
    <div class="echartCardtitle">
      <div class="card-title">销量类别占比</div>
      <el-button-group>
        <el-button type="primary" plain>本月</el-button>
        <el-button>本年</el-button>
      </el-button-group>
    </div>
    <div id="bchart2" class="echarts" />
  </el-card>
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
        name: 'Access From',
        type: 'pie',
        radius: ['70%', '100%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{font|总销售额}\n{num|¥145000}',
          rich: {
            font: {
              fontSize: '12px',
            },
            num: {
              fontSize: '20px',
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  }
  option && chart.setOption(option)
}
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
