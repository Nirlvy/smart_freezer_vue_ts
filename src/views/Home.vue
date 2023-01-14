<template>
  <div id="main" class="main" style="width: 400px; height: 300px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { onMounted } from "vue"

onMounted(() => {
  echartsInit()
})

const echartsInit = () => {
  var chartDom = document.getElementById("main")
  var myChart = echarts.init(chartDom as HTMLElement)
  var option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  }
  option && myChart.setOption(option)
  console.log(1)
}
</script>

<style scoped></style>
