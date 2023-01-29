<template>
  <div class="bg">
    <div class="left">
      <el-table :data="tableData" @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="50px" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="capacity" label="容量" />
        <el-table-column prop="shelves" label="在架" />
        <el-table-column prop="enable" label="启用">
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
        <el-table-column label="需要补充">
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
        <el-descriptions title="冰柜信息" :column="3" border>
          <template #extra>
            <el-button type="primary">重置</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                Username
              </div>
            </template>
            kooriookami
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <iphone />
                </el-icon>
                Telephone
              </div>
            </template>
            18100000000
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <location />
                </el-icon>
                Place
              </div>
            </template>
            Suzhou
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <tickets />
                </el-icon>
                Remarks
              </div>
            </template>
            <el-tag size="small">School</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <office-building />
                </el-icon>
                Address
              </div>
            </template>
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="rd" id="container" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from "vue"
import request from "../utils/request"

const tableData = ref()
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}
const server = inject("ServerIp")
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
const load = () => {
  request.get(server + "/freezer/list?id=" + user.id).then((res) => {
    tableData.value = res
  })
}
load()
const handleChange = (row: any) => {}
const handleRowClick = (row: number) => {}
</script>

<style scoped>
#container {
  width: 100%;
  height: 50%;
}
.bg,
.left,
.right {
  width: 100%;
  height: 100%;
}
.bg {
  display: flex;
  padding: 10px;
}
.left {
  margin-right: 5px;
}
.right {
  display: flex;
  flex-direction: column;
}
.ru,
.rd {
  flex: 1;
  height: 50%;
  width: 100%;
}
.left,
.ru,
.rd {
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
.ru {
  padding: 10px;
  margin-bottom: 5px;
}
.rd {
  margin-top: 5px;
}
</style>
