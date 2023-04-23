<template>
  <el-row :gutter="10" class="row">
    <el-col v-for="(item, index) in order" :key="index" :span="8">
      <el-card :body-style="cardStyle">
        <div :id="item" class="echart" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { getCommodityByIndex, getComplexlyPage } from '@/utils/commonRequset'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted } from 'vue'
import { useFreezerStore, useItemStore } from '@/store/store'

var chart: echarts.ECharts[] = []
var option: echarts.EChartsOption[] = []
var chartDom: HTMLCanvasElement[] = []

const order = ['first', 'second', 'third']
const cardStyle = {
  padding: '10px',
  height: '100%',
}
const itemStore = useItemStore()
const FreezerStore = useFreezerStore()

onMounted(() => {
  window.addEventListener('resize', initEcharts)
  initEcharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const initEcharts = async () => {
  if (chart.length != 0) {
    chart.forEach((item) => {
      item.dispose()
    })
    chart.length = 0
    option.length = 0
    chartDom.length = 0
  }
  const todayStamp = new Date(new Date().toLocaleDateString()).getTime()
  const nowStamp = Date.now()
  if (itemStore.allItem.length === 0 && itemStore.itemCount === 0) {
    const res = await getComplexlyPage({ pageSize: 100000, currentPage: 1 }, { time: [todayStamp, nowStamp] })
    if (!res) return
    itemStore.allItem = res.data
    itemStore.itemCount = res.totalElements
  }
  const count = itemStore.allItem.reduce((acc, curr) => {
    Object.keys(curr.sale).forEach((key) => {
      if (curr.sale[key] === '1') {
        if (acc[key]) {
          acc[key]++
        } else {
          acc[key] = 1
        }
      }
    })
    return acc
  }, {})
  for (const key in count) {
    if (!itemStore.id2Item.find((item) => Object.keys(item)[0] === key)) {
      const res2 = await getCommodityByIndex(key)
      if (!res2) {
        return
      }
      Array.isArray(itemStore.id2Item) ? itemStore.id2Item.push({ [key]: res2.name }) : (itemStore.id2Item = [{ [key]: res2.name }])
    }
  }
  order.forEach((item) => chartDom.push(document.getElementById(item) as HTMLCanvasElement))
  chartDom.forEach((item) => chart.push(echarts.init(item)))
  for (var i = 0; i < 3; i++) {
    option[i] = {
      title: {
        text: '商品销售占比',
        left: 'center',
      },
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
        bottom: '0%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '50%'],
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
  }
  let result: Array<{ value: number; name: string }> = []
  for (const key in count) {
    const countKey = count[key]
    const item = itemStore.id2Item.find((item) => Object.keys(item)[0] === key)
    if (item) {
      const name = item[key]
      const value = { value: countKey, name: name }
      result.push(value)
    }
  }
  option[0] ? (option[0].series ? (option[0].series[0].data = result) : '') : ''
  option[0] ? (option[0].series ? (option[0].series[0].center = ['50%', '37%']) : '') : ''
  option.forEach((item, index) => item && chart[index].setOption(item))
}
</script>

<style scoped>
.row {
  height: 100%;
  width: 100%;
}
.el-card {
  height: 100%;
}
.echart {
  height: 100%;
}
</style>
