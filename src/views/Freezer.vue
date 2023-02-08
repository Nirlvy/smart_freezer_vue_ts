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
            <el-button type="primary" @click="handleDrawer"
              >位置修改
            </el-button>
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
      <div id="container" class="rd" />
    </div>
    <el-drawer v-model="drawer" size="50%">
      <template #header>
        <h4>冰柜信息编辑</h4>
      </template>
      <template #default>
        <div class="drawer">
          <input id="tipinput" v-model="input" class="input" placeholder="" />
          <div id="drawerContainer" />
        </div>
      </template>
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
import { onMounted, reactive, ref } from 'vue'
import {
  Box,
  Clock,
  Connection,
  Location,
  Odometer,
  ShoppingTrolley,
  User,
} from '@element-plus/icons-vue'
import request from '../utils/request'
import * as echarts from 'echarts'
import { useStore } from '../store/store'
import { shallowRef } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import {
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElDescriptions,
  ElButton,
  ElDescriptionsItem,
  ElIcon,
  ElDrawer,
} from 'element-plus'

const store = useStore()
const tableData = ref()
const user = store.user
const server = store.ServerIp
const drawer = ref(false)
const input = shallowRef()
const freezerinfo = reactive({
  id: '',
  location: '',
  capacity: '',
  shelves: '',
  enable: '',
  need: '',
  lastSupply: '',
  releaseTime: '',
})
const markerList = reactive({})
const load = () => {
  request.get(server + '/freezer/list?id=' + user.id).then((res) => {
    tableData.value = res
  })
}
load()
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'f0acd0d469d95ee4c57156a7ceedd9fe',
  }
  initMap()
})
const handleDrawer = () => {
  drawer.value = true
  initDrawer()
}
const initMap = () => {
  AMapLoader.load({
    key: '6f0e7fef63c86008906382ceeb13036e', //首次load key为必填
    version: '2.0',
  })
    .then((AMap) => {
      let map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 5, //初始化地图级别
        center: [118.50685, 31.668765], //初始化地图中心点位置
      })
      map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar'], () => {
        var element = document.querySelector('.rd') as HTMLElement
        if (element) {
          var height = element.offsetHeight
          map.addControl(
            new AMap.Scale({
              offset: [10, 20 - height],
              position: 'LB',
            })
          )
          map.addControl(
            new AMap.ControlBar({
              position: 'RT',
            })
          )
          map.addControl(
            new AMap.ToolBar({
              offset: [30, 100],
              position: 'RT',
            })
          )
        }
      })
    })
    .catch((e) => {
      console.error(e)
    })
}
const initDrawer = () => {
  AMapLoader.load({
    key: '6f0e7fef63c86008906382ceeb13036e', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      //地图加载
      var map = new AMap.Map('drawerContainer', {
        resizeEnable: true,
      })
      //输入提示
      var autoOptions = {
        input: 'tipinput',
      }
      AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
        var auto = new AMap.AutoComplete(autoOptions)
        var placeSearch = new AMap.PlaceSearch({
          map: map,
        }) //构造地点查询类
        auto.on('select', select) //注册监听，当选中某条记录时会触发
        function select(e: { poi: { adcode: any; name: any } }) {
          console.log(e)
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name) //关键字查询查询
        }
      })
    })
    .catch((e) => {
      console.log(e)
    })
}
const initEcharts = (row: any) => {
  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom as HTMLElement)
  var option = {
    // title: {
    //   text: "销售情况",
    // },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [] as string[],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
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
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [] as any,
  }
  request
    .get<{ data: RServerData }, RServerData>(
      server + '/shelvesLog/freezer?id=' + row.id
    )
    .then((res) => {
      option.legend.data = [
        ...res.data[0],
        ...res.data[0].map((item: string) => `${item}售出`),
      ]
      for (var i = 0; i < res.data[1].length; i++) {
        option.series.push({
          name: res.data[0][i],
          type: 'line',
          data: res.data[1][i],
        })
        option.series.push({
          name: res.data[0].map((item: string) => `${item}售出`)[i],
          type: 'line',
          data: res.data[2][i],
        })
      }
      option && myChart.setOption(option, true)
    })
}

const handleChange = (row: any) => {}
const handleRowClick = (row: any) => {
  Object.assign(freezerinfo, row)
  for (const key in freezerinfo) {
    if (freezerinfo[key] === true) {
      freezerinfo[key] = '是'
    } else if (freezerinfo[key] === false) {
      freezerinfo[key] = '否'
    }
  }
  initEcharts(row)
}
const cancelClick = () => {}
const confirmClick = () => {}
</script>

<style scoped>
#container {
  width: 100%;
  height: 50%;
}
#drawerContainer {
  width: 100%;
  height: 100%;
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
.drawer {
  width: 100%;
  height: 100%;
}
.input {
  position: absolute;
  z-index: 1;
}
.amap-controls {
  height: 100% !important;
}
</style>
