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
  </div>
  <el-row style="justify-content: center">
    <div id="shelves" class="charts" />
    <div id="sold" class="charts" />
    <div id="pie" class="charts" />
  </el-row>
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import request from "../utils/request"

onMounted(() => {
  valueInit()
})

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

interface LServerData {
  code?: string
  records: object
  total: number
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

interface RServerData {
  code: string
  data: object
  msg: string
}

const router = useRouter()

const value = reactive({
  freezerId: [0],
  totalfreezer: 0,
  runfreezer: 0,
  totalshelves: 0,
  totalsold: 0,
  waiting: 0,
})

const month = [
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
]

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}

const valueInit = () => {
  request
    .get<{ data: LServerData }, LServerData>(
      "/user/page?pageNum=1" + "&pageSize=1" + "&userName=" + user.userName
    )
    .then((res) => {
      if (res.code != "401") {
        value.totalshelves = res.records[0].shelves
        value.totalsold = res.records[0].sold
        request
          .get<{ data: HServerData }, HServerData>(
            "/freezer/home?id=" + user.id
          )
          .then((res) => {
            value.totalfreezer = res.data.totalfreezer
            value.runfreezer = res.data.runfreezer
            value.waiting = res.data.needfreezer
            value.freezerId = res.data.freezerId
            echartsInit()
          })
      }
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
      data: month,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} 个",
      },
    },
    series: [
      {
        data: [0],
        type: "line",
      },
    ],
    label: {
      show: true,
    },
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
      data: month,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} 个",
      },
    },
    series: [
      {
        data: [0],
        type: "line",
      },
    ],
    label: {
      show: true,
    },
  }

  var pieChartDom = document.getElementById("pie")
  var pieChart = echarts.init(pieChartDom as HTMLElement)
  var pieOption = {
    title: {
      text: "销售数量比",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        label: {
          formatter: "{b}:{c}瓶,{d}%",
          // position: "inside",
        },
        data: [{}],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  }
  if (value.freezerId.length != 0)
    request
      .post<{ data: SServerData }, SServerData>(
        "/echarts/months",
        value.freezerId
      )
      .then((res) => {
        shelvesOption.series[0].data = res.data[0]
        soldOption.series[0].data = res.data[1]
        shelvesOption && shelvesChart.setOption(shelvesOption)
        soldOption && soldChart.setOption(soldOption)
        pieOption && pieChart.setOption(pieOption)
      })
  request
    .post<{ data: RServerData }, RServerData>("/echarts/sold", value.freezerId)
    .then((res) => {
      pieOption.series[0].data = res.data[0].map(
        (item: number | string, index: number) => ({
          name: item,
          value: res.data[1][index],
        })
      )
    })
}
</script>

<style scoped>
.cardline {
  padding: 40px;
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
  width: 30%;
  height: 400px;
  margin: 20px;
  border: 10px;
  padding-top: 30px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
</style>
