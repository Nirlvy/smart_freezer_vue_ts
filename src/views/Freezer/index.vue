<template>
  <div class="bg">
    <div class="top"><Top /></div>
    <div class="bottom"><Bottom /></div>
  </div>
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import Bottom from './components/Bottom.vue'
</script>

<style scoped>
.bg {
  display: flex;
  flex-direction: column;
}
.top {
  margin-bottom: 10px;
}
</style>

<!-- <template>
  <div class="bg">
    <div class="left" :class="{ click: lineClick }">
      <el-table :data="tableData" @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="40px" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="capacity" label="容量" width="50px" />
        <el-table-column prop="shelves" label="在架" width="50px" />
        <el-table-column prop="disabled" label="禁用" width="50px">
          <template #default="scope">
            <el-switch
              v-model="scope.row.disabled"
              inline-prompt
              active-text="是"
              inactive-text="否"
              :disabled="scope.row.location == '' || scope.row.location == null"
              @change="handleChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="补充" width="50px">
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
    <div class="right" :class="{ click: lineClick }">
      <div class="ru">
        <el-descriptions class="des" title="冰柜信息" :column="4" border>
          <template #extra>
            <span v-show="newButton === '确定'" style="font-size: 15px"
              >新冰柜容量:
            </span>
            <el-input-number
              v-show="newButton === '确定'"
              v-model="capacity"
              placeholder="冰柜容量"
              style="margin-right: 10px"
              :min="1"
            />
            <el-button type="primary" @click="handleNew"
              >{{ newButton }}
            </el-button>
            <el-button
              v-if="freezerinfo.id != ''"
              type="primary"
              @click="handleDrawer"
              >信息修改
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
          <el-form class="inputDiv">
            <el-form-item label="容量">
              <el-input-number v-model="capacity" :min="capacityMin" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input
                id="tipinput"
                v-model="input"
                class="input"
                :prefix-icon="Search"
                placeholder="请输入搜索的地址"
                clearable
                @input="changeZIndex"
              />
            </el-form-item>
            <el-form-item label="请在下方地图右键选择新地址:" />
          </el-form>
          <div class="drawerMap">
            <div id="drawerContainer" />
          </div>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="danger" @click="deleteClick">删除</el-button>
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  Box,
  Clock,
  Connection,
  Location,
  Odometer,
  Search,
  ShoppingTrolley,
  User,
} from '@element-plus/icons-vue'
import request from '@/utils/request'
import * as echarts from 'echarts'
import { useMainStore } from '@/store/store'
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
  ElMessage,
} from 'element-plus'
const store = useMainStore()
const tableData = ref()
const lineClick = ref(false)
const user = store.user
const freezer = store.freezer
const drawer = ref(false)
const input = shallowRef()
const capacity = ref()
const capacityMin = ref()
const freezerinfo = reactive({
  id: '',
  position: '',
  location: '',
  capacity: '',
  shelves: '',
  enable: '',
  need: '',
  lastSupply: '',
  releaseTime: '',
})
const position = ref()
const formattedAddress = ref()
const newButton = ref('新增')
var myChart: echarts.ECharts

const load = () => {
  return new Promise<void>((resolve) => {
    request.get('/freezer/list?id=' + user.id).then((res) => {
      tableData.value = res
      freezer.forEach((item, index) => {
        item.capacity = tableData.value[index].capacity
      })
      tableData.value.forEach((item: { shelves: number }, index: number) => {
        item.shelves = freezer[index].shelves
      })
      initMap()
      resolve()
    })
  })
}

const clear = () => {
  Object.assign(freezerinfo, {
    id: '',
    position: '',
    location: '',
    capacity: '',
    shelves: '',
    enable: '',
    need: '',
    lastSupply: '',
    releaseTime: '',
  })
  drawer.value = false
  lineClick.value = false
  echarts.init(document.getElementById('main') as HTMLElement).dispose()
  tableData.value = null
  load()
}

onMounted(() => {
  // TODO:编译前删除
  window._AMapSecurityConfig = {
    securityJsCode: 'f0acd0d469d95ee4c57156a7ceedd9fe',
  }
  load()
  window.addEventListener('resize', initEcharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initEcharts)
})

const handleDrawer = () => {
  drawer.value = true
  newButton.value = '新增'
  initDrawer()
}

const initMap = () => {
  AMapLoader.load({
    key: '6f0e7fef63c86008906382ceeb13036e',
    version: '2.0',
  })
    .then((AMap) => {
      let map = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 5,
        center: [118.50685, 31.668765],
      })
      map.plugin(
        ['AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar'],
        async () => {
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
              new AMap.ToolBar({
                offset: [10, 20 - height],
                position: 'RB',
              })
            )
            const markerClick = (e: { target: { _position: any[] } }) => {
              for (let i = 0; i < tableData.value.length; i++) {
                if (
                  tableData.value[i].position === e.target._position.join(',')
                ) {
                  handleRowClick(tableData.value[i])
                }
              }
            }
            await tableData.value.forEach(
              (markerinfo: {
                id: number
                position: string | null
                location: string | null
              }) => {
                if (markerinfo.position != null) {
                  const position = markerinfo.position.split(',').map(Number)
                  const marker = new AMap.Marker({
                    map: map,
                    position: position,
                  })
                  marker.setLabel({
                    direction: 'top',
                    content: '<div>' + markerinfo.location + '</div>',
                  })
                  marker.on('click', markerClick)
                }
              }
            )
            map.setFitView(null, false, [150, 60, 100, 60])
          }
        }
      )
    })
    .catch((e) => {
      ElMessage.error(e)
    })
}

const initDrawer = () => {
  capacity.value = freezerinfo.capacity
  capacityMin.value =
    freezer[store.getIndex('freezerId', Number(freezerinfo.id))].shelves
  AMapLoader.load({
    key: '6f0e7fef63c86008906382ceeb13036e',
    version: '2.0',
  })
    .then((AMap) => {
      var map = new AMap.Map('drawerContainer', {
        resizeEnable: true,
      })
      map.plugin(
        [
          'AMap.PlaceSearch',
          'AMap.AutoComplete',
          'AMap.MouseTool',
          'AMap.Geocoder',
        ],
        () => {
          var autoOptions = {
            input: 'tipinput',
          }
          // 自动填充
          var auto = new AMap.AutoComplete(autoOptions)
          // 点击搜索
          var placeSearch = new AMap.PlaceSearch({
            map: map,
          })
          const select = (e: { poi: { adcode: number; name: string } }) => {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name)
          }
          auto.on('select', select)
          //创建右键菜单
          var contextMenu = new AMap.ContextMenu()
          contextMenu.addItem(
            '放大一级',
            () => {
              map.zoomIn()
            },
            0
          )
          contextMenu.addItem(
            '缩小一级',
            () => {
              map.zoomOut()
            },
            1
          )
          contextMenu.addItem(
            '缩放至全国范围',
            () => {
              map.setZoomAndCenter(4, [108.946609, 34.262324])
            },
            2
          )
          contextMenu.addItem(
            '添加标记',
            async () => {
              map.getAllOverlays('marker').forEach((item: any) => {
                item.remove()
              })
              await geo()
              var marker = new AMap.Marker({
                map: map,
                position: position.value,
              })
              marker.setLabel({
                direction: 'top',
                content: '<div>' + formattedAddress.value + '</div>',
              })
              contextMenu.close()
            },
            3
          )
          map.on('rightclick', function (e: { lnglat: [number, number] }) {
            contextMenu.open(map, e.lnglat)
            position.value = e.lnglat
          })
          const geo = () => {
            return new Promise<void>((resolve) => {
              var geocoder = new AMap.Geocoder({
                extensions: 'all',
              })
              geocoder.getAddress(
                position.value,
                (
                  status: string,
                  result: {
                    info: string
                    regeocode: {
                      formattedAddress: any
                      pois: { name: string }[]
                    }
                  }
                ) => {
                  if (status === 'complete' && result.info === 'OK') {
                    formattedAddress.value = result.regeocode.formattedAddress
                    resolve()
                  }
                }
              )
            })
          }
        }
      )
    })
    .catch((e) => {
      ElMessage.error(e)
    })
}

const initEcharts = () => {
  if (freezerinfo.id == '') {
    return
  }
  if (myChart != undefined) {
    myChart.dispose()
  }
  var chartDom = document.getElementById('main')
  myChart = echarts.init(chartDom as HTMLElement)
  var option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [] as string[],
    },
    grid: {
      left: '1%',
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
  request.get('/shelvesLog/freezer?id=' + freezerinfo.id).then((res) => {
    if (res.code === 200) {
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
    }
  })
}

const handleChange = (row: any) => {
  request.post('/freezer/update', row).then((res) => {
    if (res.code === 200) {
      ElMessage.success('修改成功')
    } else {
      load()
    }
  })
}

const handleRowClick = (row: any) => {
  Object.assign(freezerinfo, row)
  for (const key in freezerinfo) {
    if (freezerinfo[key] === true) {
      freezerinfo[key] = '否'
    } else if (freezerinfo[key] === false) {
      freezerinfo[key] = '是'
    }
  }
  lineClick.value = true
  setTimeout(() => {
    initEcharts()
  }, 500)
}

const deleteClick = () => {
  request.delete('/freezer/' + freezerinfo.id).then((res) => {
    if (res) {
      ElMessage.success('删除成功！')
      freezer.splice(store.getIndex('freezerId', freezerinfo.id))
      clear()
    }
  })
}

const cancelClick = () => {
  drawer.value = false
}

const confirmClick = () => {
  for (const key in freezerinfo) {
    if (freezerinfo[key] === '是') {
      freezerinfo[key] = false
    } else if (freezerinfo[key] === '否') {
      freezerinfo[key] = true
    }
  }
  freezerinfo.capacity = capacity.value
  freezerinfo.location = formattedAddress.value
  freezerinfo.position = position.value.toString()
  request.post('/freezer/update', freezerinfo).then((res) => {
    if (res.code === 200) {
      ElMessage.success('修改成功')
      clear()
    }
  })
}

const changeZIndex = () => {
  document
    .querySelectorAll('.amap-sug-result')
    .forEach((item) => ((item as HTMLElement).style.zIndex = '9999'))
}

const handleNew = () => {
  if (newButton.value === '新增') {
    capacity.value = 1
    newButton.value = '确定'
    capacityMin.value = 1
  } else {
    freezerinfo.capacity = capacity.value
    request
      .get('/freezer/capacity?id=' + user.id + '&capacity=' + capacity.value)
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success('新增成功')
          newButton.value = '新增'
          request.get('/freezer/list?id=' + user.id).then((res) => {
            tableData.value = res
            freezer.push({
              freezerId: tableData.value[tableData.value.length - 1].id,
              disabled: true,
              shelves: 0,
              capacity: capacity.value,
            })
            tableData.value.forEach(
              (item: { shelves: number }, index: number) => {
                item.shelves = freezer[index].shelves
              }
            )
            clear()
          })
        }
      })
  }
}
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
  padding: 0.3%;
  height: 100%;
  width: 70%;
  margin-right: 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
  will-change: width;
  transition: width 0.5s ease-in-out;
}
.left.click {
  width: 30%;
}
.right {
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  will-change: width;
  transition: width 0.5s ease-in-out;
}
.right.click {
  width: 70%;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.drawerMap {
  bottom: 0;
  width: 100%;
  flex: 1;
}
.inputDiv {
  width: 100%;
  min-height: 100px;
}
.input {
  width: 50%;
  min-width: 180px;
}
</style> -->
