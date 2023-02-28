<template>
  <el-card class="echartCard">
    <div class="echartCardtitle">
      <div class="card-title">销量趋势</div>
      <el-button-group>
        <el-button type="primary">本月</el-button>
        <el-button>本年</el-button>
      </el-button-group>
    </div>
    <div id="bchart" class="echarts" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'

type EChartsOption = echarts.EChartsOption

var chart: echarts.ECharts
var option: EChartsOption

onMounted(() => {
  initEcharts()
})

const initEcharts = () => {
  var chartDom = document.getElementById('bchart') as HTMLCanvasElement
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
</script>

<style scoped>
.echartCard .echarts {
  flex: 1;
}
</style>
