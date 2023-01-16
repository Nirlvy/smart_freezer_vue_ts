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
              <span class="value">{{ value.runfreezer }}</span>
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
              <span class="value">{{ value.waiting }}</span>
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
              <span class="value">{{ value.totalshelves }}</span>
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
              <span class="value">{{ value.totalsold }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-row>
    <div id="shelves" style="width: 30%; height: 400px" />
    <div id="sold" style="width: 30%; height: 400px" />
  </el-row>
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { onMounted, reactive } from "vue"
import request from "../utils/request"

onMounted(() => {
  valueInit()
})

interface HServerResponse {
  data: HServerData
}

interface HchartsData {
  freezerId: number[]
  totalfreezer: number
  runfreezer: number
  needfreezer: number
}

interface HServerData {
  code: string
  data: HchartsData
  msg: string
}

interface LServerResponse {
  data: LServerData
}

interface LServerData {
  records: object
  total: number
}

interface SServerResponse {
  data: SServerData
}

interface SServerDataData {
  shelves: number[]
  sold: number[]
}

interface SServerData {
  code: string
  data: SServerDataData
  msg: string
}

const value = reactive({
  freezerId: [0],
  totalfreezer: 0,
  runfreezer: 0,
  totalshelves: 0,
  totalsold: 0,
  waiting: 0,
})

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}

const valueInit = () => {
  request
    .get<HServerResponse, HServerData>("/freezer/home?id=" + user.id)
    .then((res) => {
      value.totalfreezer = res.data.totalfreezer
      value.runfreezer = res.data.runfreezer
      value.waiting = res.data.needfreezer
      value.freezerId = res.data.freezerId
      echartsInit()
    })
  request
    .get<LServerResponse, LServerData>(
      "/user/page?pageNum=1" + "&pageSize=1" + "&userName=" + user.userName
    )
    .then((res) => {
      value.totalshelves = res.records[0].shelves
      value.totalsold = res.records[0].sold
    })
}

const echartsInit = () => {
  var shelvesChartDom = document.getElementById("shelves")
  var shelvesChart = echarts.init(shelvesChartDom as HTMLElement)
  var shelvesOption = {
    title: {
      left: "center",
      text: "每月上架数",
    },
    xAxis: {
      type: "category",
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [0],
        type: "line",
      },
    ],
  }
  var soldChartDom = document.getElementById("sold")
  var soldChart = echarts.init(soldChartDom as HTMLElement)
  var soldOption = {
    title: {
      left: "center",
      text: "每月售出数",
    },
    xAxis: {
      type: "category",
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [0],
        type: "line",
      },
    ],
  }
  request
    .post<SServerResponse, SServerData>("/echarts/months", value.freezerId)
    .then((res) => {
      console.log(res.data)
      shelvesOption.series[0].data = res.data[0]
      soldOption.series[0].data=res.data[1]
      shelvesOption && shelvesChart.setOption(shelvesOption)
      soldOption && soldChart.setOption(soldOption)
    })
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
