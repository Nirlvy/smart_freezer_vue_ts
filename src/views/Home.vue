<template>
  <div class="line">
    <el-row :gutter="20" style="height: 45%">
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>总冰柜</span>
            <div class="bottom">
              <span class="value">{{ value.totalfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1" />
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>运行冰柜</span>
            <div class="bottom">
              <span class="value">{{ value.runfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1" />
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>需要补充</span>
            <div class="bottom">
              <span class="value">{{ value.waiting }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1" />
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>总上架</span>
            <div class="bottom">
              <span class="value">{{ value.totalshelves }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1" />
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>已售出</span>
            <div class="bottom">
              <span class="value">{{ value.totalsold }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="justify-content: center; height: 50%; margin-top: 2%"
    >
      <el-col :span="8"><div id="shelves" class="charts" /></el-col>
      <el-col :span="8"> <div id="sold" class="charts" /></el-col>
      <el-col :span="8"> <div id="pie" class="charts" /></el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ElRow, ElCol, ElCard } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useStore } from '../store/store'
import request from '../utils/request'

onMounted(() => {
  valueInit()
  window.addEventListener('resize', echartsInit)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', echartsInit)
})
const store = useStore()
const value = reactive({
  freezerId: [] as number[],
  totalfreezer: 0,
  runfreezer: 0,
  totalshelves: 0,
  totalsold: 0,
  waiting: 0,
})
const month = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]
const user = store.user
const valueInit = () => {
  request
    .get<{ data: RServerData }, RServerData>('/freezer/home?id=' + user.id)
    .then((res) => {
      value.totalfreezer = res.data.totalfreezer
      value.runfreezer = res.data.runfreezer
      value.waiting = res.data.needfreezer
      value.freezerId = res.data.freezerId
      user.freezerId = res.data.freezerId
      echartsInit()
    })
}
const echartsInit = () => {
  echarts.init(document.getElementById('shelves') as HTMLElement).dispose()
  echarts.init(document.getElementById('sold') as HTMLElement).dispose()
  echarts.init(document.getElementById('pie') as HTMLElement).dispose()
  var shelvesChartDom = document.getElementById('shelves')
  var shelvesChart = echarts.init(shelvesChartDom as HTMLElement)
  var shelvesOption = {
    title: {
      left: 'center',
      text: '每月上架数',
    },
    xAxis: {
      type: 'category',
      data: month,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 个',
      },
    },
    series: [
      {
        data: [0],
        type: 'line',
      },
    ],
    label: {
      show: true,
    },
  }
  var soldChartDom = document.getElementById('sold')
  var soldChart = echarts.init(soldChartDom as HTMLElement)
  var soldOption = {
    title: {
      left: 'center',
      text: '每月售出数',
    },
    xAxis: {
      type: 'category',
      data: month,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 个',
      },
    },
    series: [
      {
        data: [0],
        type: 'line',
      },
    ],
    label: {
      show: true,
    },
  }
  var pieChartDom = document.getElementById('pie')
  var pieChart = echarts.init(pieChartDom as HTMLElement)
  var pieOption = {
    title: {
      text: '销售数量比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        label: {
          formatter: '{b}:{c}瓶,{d}%',
        },
        data: [{}],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  if (value.freezerId.length != 0)
    request
      .post<{ data: RServerData }, RServerData>(
        '/shelvesLog/monthsCharts',
        value.freezerId
      )
      .then((res) => {
        shelvesOption.series[0].data = res.data[0]
        value.totalshelves = res.data[0].reduce(
          (acc: number, cur: number) => acc + cur,
          0
        )
        soldOption.series[0].data = res.data[1]
        value.totalsold = res.data[1].reduce(
          (acc: number, cur: number) => acc + cur,
          0
        )
        shelvesOption && shelvesChart.setOption(shelvesOption)
        soldOption && soldChart.setOption(soldOption)
      })
  request
    .post<{ data: RServerData }, RServerData>(
      '/shelvesLog/soldCharts',
      value.freezerId
    )
    .then((res) => {
      pieOption.series[0].data = res.data[0].map(
        (item: string, index: number) => ({
          name: item,
          value: res.data[1][index],
        })
      )
      user.goods = res.data[0]
      pieOption && pieChart.setOption(pieOption)
    })
}
</script>

<style scoped>
.line {
  padding: 40px;
  height: 100%;
  overflow: hidden;
}
.value {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.image {
  width: 100%;
  display: block;
}

.charts {
  width: 100%;
  height: 100%;
  border: 10px;
  padding-top: 30px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
</style>
