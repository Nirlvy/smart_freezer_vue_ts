<template>
  <div class="bg">
    <div class="left">
      <el-table :data="tableData" @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="50px" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="capacity" label="容量" width="60px" />
        <el-table-column prop="shelves" label="在架" width="60px" />
        <el-table-column prop="enable" label="启用" width="60px">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enable"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              @change="handleChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="需要补充" width="80px">
          <template #default="scope">
            <el-switch
              v-model="scope.row.need"
              inline-prompt
              active-text="是"
              inactive-text="否"
              @change="handleChange(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right">
      <div class="ru">
        <el-descriptions class="des" title="冰柜信息" :column="4" border>
          <template #extra>
            <el-button type="primary" @click="click">编辑</el-button>
          </template>
          <el-descriptions-item min-width="90px" label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <User />
                </el-icon>
                设备ID
              </div>
            </template>
            {{ freezerinfo.id }}
          </el-descriptions-item>
          <el-descriptions-item min-width="80px" label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Location />
                </el-icon>
                位置
              </div>
            </template>
            {{ freezerinfo.location }}
          </el-descriptions-item>
          <el-descriptions-item min-width="100px" label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Box />
                </el-icon>
                容量
              </div>
            </template>
            {{ freezerinfo.capacity }}
          </el-descriptions-item>
          <el-descriptions-item min-width="100px" label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <ShoppingTrolley />
                </el-icon>
                在架
              </div>
            </template>
            {{ freezerinfo.shelves }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Connection />
                </el-icon>
                启用
              </div>
            </template>
            {{ freezerinfo.enable }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Odometer />
                </el-icon>
                需求
              </div>
            </template>
            {{ freezerinfo.need }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Clock />
                </el-icon>
                最后补充
              </div>
            </template>
            {{ freezerinfo.lastSupply }}
          </el-descriptions-item>
          <el-descriptions-item label-align="center">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Clock />
                </el-icon>
                设置时间
              </div>
            </template>
            {{ freezerinfo.releaseTime }}
          </el-descriptions-item>
        </el-descriptions>
        <div id="main" class="echarts" />
      </div>
      <div class="rd" id="container" />
    </div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>set title by slot</h4>
      </template>
      <template #default> </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick"> confirm </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import {
  Box,
  Clock,
  Connection,
  Location,
  Odometer,
  ShoppingTrolley,
  User,
} from "@element-plus/icons-vue"
import request from "../utils/request"
import * as echarts from "echarts"
import { useStore } from "../store/store"

const store = useStore()
const tableData = ref()
const user = store.user
const server = store.ServerIp
const drawer = ref(false)
const freezerinfo = reactive({
  id: "",
  location: "",
  capacity: "",
  shelves: "",
  enable: "",
  need: "",
  lastSupply: "",
  releaseTime: "",
})
onMounted(() => {
  var script = document.createElement("script")
  script.type = "text/javascript"
  script.src =
    "https://map.qq.com/api/gljs?v=1.exp&key=7VCBZ-5FWK3-KFF3A-YNJHS-UMFS6-5VFJI"
  document.body.appendChild(script)
  script.onload = () => {
    initMap()
  }
})
const initMap = () => {
  var center = new TMap.LatLng(39.98210863924864, 116.31310899739151)
  var centerHeight = new TMap.LatLng(39.98210863924864, 116.31310899739151, 134)

  // 初始化地图
  var map = new TMap.Map("container", {
    zoom: 17, // 设置地图缩放
    center: new TMap.LatLng(39.98210863924864, 116.31310899739151), // 设置地图中心点坐标，
    pitch: 0, // 俯仰度
    rotation: 0, // 旋转角度
  })

  // MultiMarker文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker
  var marker = new TMap.MultiMarker({
    map: map,
    styles: {
      // 点标记样式
      marker: new TMap.MarkerStyle({
        width: 20, // 样式宽
        height: 30, // 样式高
        anchor: { x: 10, y: 30 }, // 描点位置
      }),
    },
    geometries: [
      // 点标记数据数组
      {
        // 标记位置(纬度，经度，高度)
        position: center,
        id: "marker",
      },
    ],
  })
}
const initEcharts = (row: any) => {
  var chartDom = document.getElementById("main")
  var myChart = echarts.init(chartDom as HTMLElement)
  var option = {
    // title: {
    //   text: "销售情况",
    // },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [] as string[],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
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
    series: [] as any,
  }
  request
    .get<{ data: RServerData }, RServerData>(
      server + "/shelvesLog/freezer?id=" + row.id
    )
    .then((res) => {
      console.log(res)
      option.legend.data = [
        ...res.data[0],
        ...res.data[0].map((item: string) => `${item}售出`),
      ]
      for (var i = 0; i < res.data[1].length; i++) {
        option.series.push({
          name: res.data[0][i],
          type: "line",
          data: res.data[1][i],
        })
        option.series.push({
          name: res.data[0].map((item: string) => `${item}售出`)[i],
          type: "line",
          data: res.data[2][i],
        })
      }
      console.log(option)
      option && myChart.setOption(option, true)
    })
}
const load = () => {
  request.get(server + "/freezer/list?id=" + user.id).then((res) => {
    tableData.value = res
  })
}
load()
const handleChange = (row: any) => {}
const handleRowClick = (row: any) => {
  Object.assign(freezerinfo, row)
  for (const key in freezerinfo) {
    if (freezerinfo[key] === true) {
      freezerinfo[key] = "是"
    } else if (freezerinfo[key] === false) {
      freezerinfo[key] = "否"
    }
  }
  initEcharts(row)
}
const click = () => {
  drawer.value = true
  console.log(drawer.value)
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 50%;
}
.bg {
  height: 100%;
  display: flex;
  padding: 10px;
}
.left {
  height: 100%;
  width: 30%;
  margin-right: 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
.right {
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
}
.ru,
.rd {
  flex: 1;
  height: 50%;
  width: 100%;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
.ru {
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.rd {
  margin-top: 5px;
}
.cell-item {
  align-items: right;
}
.des {
  padding: 10px;
}
.echarts {
  width: 100%;
  flex: 1;
  max-height: 60%;
}
</style>
