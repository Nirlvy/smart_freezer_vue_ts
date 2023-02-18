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
      v-if="store.freezer[0]"
      :gutter="20"
      style="justify-content: center; height: 50%; margin-top: 2%"
    >
      <el-col :span="8"> <div id="shelves" class="charts" /></el-col>
      <el-col :span="8"> <div id="sold" class="charts" /></el-col>
      <el-col :span="8"> <div id="pie" class="charts" /></el-col>
    </el-row>
    <div v-else class="tip">
      <p>还没有冰柜哦,要</p>
      <router-link to="/manage/freezer" style="text-decoration: none"
        >设置
      </router-link>
      <p>一个吗</p>
    </div>
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
var shelvesChart: echarts.ECharts
var soldChart: echarts.ECharts
var pieChart: echarts.ECharts

const valueInit = () => {
  request.get('/freezer/home?id=' + user.id).then((res) => {
    value.totalfreezer = res.data.totalfreezer
    value.runfreezer = res.data.runfreezer
    value.waiting = res.data.needfreezer
    value.freezerId = res.data.freezerId
    store.setValue('freezerId', res.data.freezerId)
    store.setValue('disabled', res.data.disabled)
    echartsInit()
  })
}

const echartsInit = () => {
  if (!store.freezer[0]) {
    return
  }
  if (shelvesChart != undefined) {
    shelvesChart.dispose()
    soldChart.dispose()
    pieChart.dispose()
  }
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
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        z: 999,
        silent: true,
        invisible: true,
        style: {
          fill: '#9d9d9d',
          fontWeight: 'bold',
          text: '暂无数据',
          fontSize: '25px',
        },
      },
    ],
  }
  if (value.freezerId.length != 0)
    request.post('/shelvesLog/homeinfo', value.freezerId).then((res) => {
      shelvesOption.series[0].data = res.data.monthsCharts[0]
      value.totalshelves = res.data.monthsCharts[0].reduce(
        (acc: number, cur: number) => acc + cur,
        0
      )
      if (value.totalshelves === 0) {
        pieOption.graphic[0].invisible = false
      }
      soldOption.series[0].data = res.data.monthsCharts[1]
      value.totalsold = res.data.monthsCharts[1].reduce(
        (acc: number, cur: number) => acc + cur,
        0
      )
      pieOption.series[0].data = res.data.soldCharts[0].map(
        (item: string, index: number) => ({
          name: item,
          value: res.data.soldCharts[1][index],
        })
      )
      user.goods = res.data.soldCharts[0]
      store.setValue('shelves', res.data.shelves)
      shelvesChart = echarts.init(
        document.getElementById('shelves') as HTMLElement
      )
      soldChart = echarts.init(document.getElementById('sold') as HTMLElement)
      pieChart = echarts.init(document.getElementById('pie') as HTMLElement)
      pieOption && pieChart.setOption(pieOption)
      shelvesOption && shelvesChart.setOption(shelvesOption)
      soldOption && soldChart.setOption(soldOption)
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
.tip {
  width: 100%;
  height: 50%;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
}
.router-link-active {
  text-decoration: none;
}
</style>
