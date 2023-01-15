<template>
  <div class="cardline">
    <el-row :gutter="20">
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
        </el-card></el-col
      >
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>运行冰柜</span>
            <div class="bottom">
              <span class="value">{{ value.totalfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>需要补充</span>
            <div class="bottom">
              <span class="value">{{ value.totalfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>总上架</span>
            <div class="bottom">
              <span class="value">{{ value.totalfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px; display: block; text-align: center">
            <span>已售出</span>
            <div class="bottom">
              <span class="value">{{ value.totalfreezer }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div id="main" class="main" style="width: 400px; height: 300px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { onMounted, reactive } from "vue"
import request from "../utils/request"

onMounted(() => {
  echartsInit
  valueInit
})

interface ServerResponse {
  data: ServerData
}

interface EchartsData {
  x: string[]
  y: number[]
}

interface ServerData {
  code: string
  data: EchartsData
  msg: string
}

const value = reactive({
  totalfreezer: 0,
  runfreezer: 0,
  stopfreezer: 0,
  totalshelves: 0,
  totalsold: 0,
  waiting: 0,
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
  request.get<ServerResponse, ServerData>("/echarts/example").then((res) => {
    option.xAxis.data = res.data.x
    option.series[0].data = res.data.y
  })
  option && myChart.setOption(option)
}

const valueInit = () => {
  request.post("/")
}
</script>

<style scoped>
.cardline {
  padding: 50px;
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
</style>
