<template>
  <div class="drawer">
    <el-card class="mb-5">
      <el-row :gutter="5">
        <el-col :span="10">
          <div class="flex">
            <el-image :src="'../../../src/assets/img/test1.png'" />
            <el-form class="ml-10">
              <el-form-item label="设备类型:">冷柜/单冷柜</el-form-item>
              <el-form-item label="版本型号:">1.0/</el-form-item>
              <el-form-item label="生产厂家:">{{ info?.find((item) => item.key === 'manu')?.value }}</el-form-item>
              <el-form-item label="售后服务:">{{ info?.find((item) => item.key === 'servProv')?.value }}</el-form-item>
              <el-form-item label="资产所有:">{{ info?.find((item) => item.key === 'own')?.value }}</el-form-item>
              <el-form-item label="投放地址:">{{ FreezerStore.chooseRow.address }}</el-form-item>
              <el-form-item label="当前地址:">{{ FreezerStore.chooseRow.address }}</el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="flex">
            <el-image :src="'../../../src/assets/img/test2.png'" />
            <el-form class="ml-10">
              <el-form-item label="店铺名称:">上海市浦东新区成山路111号家乐福</el-form-item>
              <el-form-item label="店铺地址:">上海市浦东新区成山路111号家乐福</el-form-item>
              <el-form-item label="店铺负责人:">张三</el-form-item>
              <el-form-item label="联系方式:">123455678</el-form-item>
              <el-form-item label="业务负责人:">李四</el-form-item>
              <el-form-item label="联系方式:">87654321</el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="5" class="center">
          <div>
            <el-button type="success" :disabled="Boolean(FreezerStore.chooseRow.SCOPE?.find((item) => item.key === 'enable')?.value)">激活</el-button>
            <el-button type="primary">解绑</el-button>
            <el-button type="success">撤柜</el-button>
            <el-button type="danger">停用</el-button>
          </div>
          <div>
            <div>工作模式选择</div>
            <el-radio-group v-model="workModeNum" @change="modeChange('work')">
              <el-radio-button v-for="item in workMode" :key="item" :label="item" />
            </el-radio-group>
          </div>
          <div>
            <div>工作模式选择</div>
            <el-radio-group v-model="runModeNum" @change="modeChange('run')">
              <el-radio-button v-for="item in runMode" :key="item" :label="item" />
            </el-radio-group>
          </div>
          <div>
            <el-button type="danger">注销</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="18">
        <div class="col-div">
          <el-row class="mb-5" :gutter="5">
            <el-col :span="9">
              <el-card>
                <span>
                  <el-icon color="#3989F5"><InfoFilled /></el-icon> 温度
                </span>
                <div class="minicard">
                  <div class="half">
                    <el-form>
                      <el-form-item label="柜内温度:">{{ data.temp }}­°C</el-form-item>
                      <el-form-item label="环境温度:">{{ data.temp2 }}­°C</el-form-item>
                      <el-form-item label="蒸发温度:">{{ data.temp3 }}­°C</el-form-item>
                      <el-form-item label="冷凝温度:">{{ data.temp4 }}­°C</el-form-item>
                    </el-form>
                  </div>
                  <div class="half">
                    <span>
                      设置：
                      <el-button type="primary" link @click="data.tempSet = !data.tempSet">{{ data.tempSetValue }}­°C</el-button>
                    </span>
                    <el-slider v-show="data.tempSet" v-model="data.tempSetValue" :step="0.5" :max="10" @change="tempSetChange" />
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="5">
              <el-card>
                <span>
                  <el-icon color="#F1534D"><InfoFilled /></el-icon> 灯光照明
                </span>
                <span class="mb-10">柜内照明: 打开</span>
                <el-radio-group v-model="lightModeNum" @change="modeChange('light')">
                  <el-radio-button v-for="item in lightMode" :key="item" :label="item" />
                </el-radio-group>
              </el-card>
            </el-col>
            <el-col :span="5">
              <el-card>
                <span>
                  <el-icon color="#41CD25"><InfoFilled /></el-icon> 运行状态
                </span>
                <el-form class="ml-10">
                  <el-form-item label="制冷系统:">{{ data.freezerSys }}</el-form-item>
                  <el-form-item label="柜门状态:">{{ data.doorState }}</el-form-item>
                  <el-form-item label="通电状态:">{{ data.powerState }}</el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="5">
              <el-card>
                <span>
                  <el-icon color="#25CDC7"><InfoFilled /></el-icon> 能耗
                </span>
                <el-form class="ml-10">
                  <el-form-item label="电流:">{{ data.A }}A</el-form-item>
                  <el-form-item label="电压:">{{ data.V }}V</el-form-item>
                  <el-form-item label="功率:">{{ data.W }}W</el-form-item>
                  <el-form-item label="电度:">{{ data.kWh }}kWh</el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="9">
              <el-card>
                <span>
                  <el-icon color="#F7B500"><InfoFilled /></el-icon> 设备编码
                </span>
                <div class="minicard">
                  <el-form>
                    <el-form-item label="控制器编码:">{{ data.devSN }}­</el-form-item>
                    <el-form-item label="资产编码:">{{}}­</el-form-item>
                    <el-form-item label="IMEI编码:">{{ FreezerStore.chooseRow.SCOPE ? FreezerStore.chooseRow.SCOPE[6].value : '' }}­</el-form-item>
                    <el-form-item label="生产编码:">{{}}­</el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-col>
            <el-col :span="10">
              <el-card>
                <div class="minicard">
                  <div class="half">
                    <span>
                      <el-icon color="#5B76F9"><InfoFilled /></el-icon> 基础模组
                    </span>
                    <el-form>
                      <el-form-item label="主程序版本:">{{ data.ctrlVer }}­</el-form-item>
                      <el-form-item label="控制逻辑版本:">{{ data.lctrlVer }}­</el-form-item>
                    </el-form>
                  </div>
                  <div class="half">
                    <span> 智能模组 </span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="5">
              <el-card>
                <span>
                  <el-icon color="#C972F2"><InfoFilled /></el-icon> 通讯
                </span>
                <div class="minicard">
                  <el-form>
                    <el-form-item label="4G:">{{}}­</el-form-item>
                    <el-form-item label="wifi:">{{}}­</el-form-item>
                    <el-form-item label="Ble:">{{}}­</el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div id="drawerContainer" class="drawerMap" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useFreezerStore, useMainStore } from '@/store/store'
import { changeScope, getDeviceProfile, getScope, modeSwitch } from '@/utils/commonRequset'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const FreezerStore = useFreezerStore()
const MainStore = useMainStore()
// const profile = ref<deviceProfile>()
const info = ref<scope[]>()
const workMode = ['制冷', '制热', '冷热']
const workModeNum = ref('')
const runMode = ['常规', '节能', '智能']
const runModeNum = ref('')
const lightMode = ['自动', '关', '开']
const lightModeNum = ref('')
const data = reactive({
  temp: 0,
  temp2: 0,
  temp3: 0,
  temp4: 0,
  tempSet: false,
  tempSetValue: 0,
  light: '',
  freezerSys: '',
  doorState: '',
  powerState: '',
  A: 0,
  V: 0,
  W: 0,
  kWh: 0,
  ctrlVer: '',
  lctrlVer: '',
  devSN: '',
})

onMounted(() => {
  setTimeout(() => init(), 1)
})

const init = async () => {
  WebSocketAPI()
  // await getDeviceProfile(FreezerStore.chooseRow.deviceProfileId.id).then((res) => {
  //   if (!res) return
  //   profile.value = res
  //   console.log(profile.value)
  // })
  await getScope(FreezerStore.chooseRow.id.id, 'info').then((res) => {
    if (!res) return
    info.value = res
  })
  workModeNum.value = workMode[Number(info.value?.find((item) => item.key === 'base.core.frhCtrl.mode')?.value)]
  runModeNum.value = runMode[Number(info.value?.find((item) => item.key === 'base.core.frhCtrl.type')?.value)]
  lightModeNum.value = lightMode[Number(info.value?.find((item) => item.key === 'base.core.light.frLight.switch')?.value)]
  data.tempSetValue = Number(info.value?.find((item) => item.key === 'base.core.frhCtrl.temp.set')?.value)
  initMap()
}

const WebSocketAPI = () => {
  var token = MainStore.Login.token
  var webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
  webSocket.onopen = function () {
    const object = {
      attrSubCmds: [{ entityType: 'DEVICE', entityId: FreezerStore.chooseRow.id.id, scope: 'CLIENT_SCOPE', cmdId: 2 }],
      tsSubCmds: [{ entityType: 'DEVICE', entityId: FreezerStore.chooseRow.id.id, scope: 'LATEST_TELEMETRY', cmdId: 1 }],
    }
    var data = JSON.stringify(object)
    webSocket.send(data)
  }
  webSocket.onmessage = function (event) {
    var received_msg = JSON.parse(event.data)
    var recData
    switch (received_msg.subscriptionId) {
      case 1:
        received_msg = received_msg['data']
        recData = {
          temp: received_msg['base.core.frhCtrl.temp.val'],
          temp2: received_msg['base.core.frhCtrl.temp4.val'],
          temp3: received_msg['base.core.frhCtrl.temp2.val'],
          temp4: received_msg['base.core.frhCtrl.temp3.val'],
          light: received_msg['base.core.light.frLight.state'],
          freezerSys: received_msg['base.core.frhCtrl.comp.stat'],
          doorState: received_msg['base.core.door.stat'],
          powerState: received_msg['base.comm.battery.stat'],
          A: received_msg['base.core.power.i'],
          V: received_msg['base.core.power.u'],
          W: received_msg['base.core.power.p'],
          kWh: received_msg['base.core.power.e'],
        }
        data.temp = recData.temp ? recData.temp[0][1] : ''
        data.temp2 = recData.temp2 ? recData.temp2[0][1] : ''
        data.temp3 = recData.temp3 ? recData.temp3[0][1] : ''
        data.temp4 = recData.temp4 ? recData.temp4[0][1] : ''
        data.light = recData.light ? (Number(recData.light[0][1]) ? '打开' : '关闭') : ''
        data.freezerSys = recData.freezerSys ? (Number(recData.freezerSys[0][1]) ? '运行' : '停止') : ''
        data.doorState = recData.doorState ? (Number(recData.doorState[0][1]) ? '开启' : '关闭') : ''
        data.powerState = recData.powerState ? (Number(recData.powerState[0][1]) ? '断电' : '通电') : ''
        data.A = recData.A ? recData.A[0][1] : ''
        data.V = recData.V ? recData.V[0][1] : ''
        data.W = recData.W ? recData.W[0][1] : ''
        data.kWh = recData.kWh ? recData.kWh[0][1] : ''
        break
      case 2:
        received_msg = received_msg['data']
        recData = {
          ctrlVer: received_msg['ctrlVer'],
          lctrlVer: received_msg['lctrlVer'],
          devSN: received_msg['devSN'],
        }
        data.ctrlVer = recData.ctrlVer ? recData.ctrlVer[0][1] : ''
        data.lctrlVer = recData.lctrlVer ? recData.lctrlVer[0][1] : ''
        data.devSN = recData.devSN ? recData.devSN[0][1] : ''
        break
    }
  }
}

const initMap = () => {
  AMapLoader.load({
    key: '6f0e7fef63c86008906382ceeb13036e',
    version: '2.0',
  })
    .then((AMap) => {
      let map = new AMap.Map('drawerContainer', {
        viewMode: '3D',
        // zoom: 1,
        resizeEnable: true,
        center: [FreezerStore.chooseRow.longitude, FreezerStore.chooseRow.latitude],
      })
      map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar'], async () => {
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
          // const markerClick = (e: { target: { _position: any[] } }) => {
          //   for (let i = 0; i < tableData.value.length; i++) {
          //     if (tableData.value[i].position === e.target._position.join(',')) {
          //       handleRowClick(tableData.value[i])
          //     }
          //   }
          // }
          // await tableData.value.forEach((markerinfo: { id: number; position: string | null; location: string | null }) => {
          //   if (markerinfo.position != null) {
          //     const position = markerinfo.position.split(',').map(Number)
          //     const marker = new AMap.Marker({
          //       map: map,
          //       position: position,
          //     })
          //     marker.setLabel({
          //       direction: 'top',
          //       content: '<div>' + markerinfo.location + '</div>',
          //     })
          //     marker.on('click', markerClick)
          //   }
          // })
          map.setFitView(null, false, [150, 60, 100, 60])
        }
      })
    })
    .catch((e) => {
      ElMessage.error(e)
    })
}

const modeChange = (mode: 'work' | 'run' | 'light') => {
  const index = {
    work: workMode.indexOf(workModeNum.value),
    run: runMode.indexOf(runModeNum.value),
    light: lightMode.indexOf(lightModeNum.value),
  }[mode]
  modeSwitch(FreezerStore.chooseRow.id.id, index, mode).then((res) => {
    if (res === '') {
      ElMessage.success('修改成功')
    }
  })
}

const tempSetChange = (temp: number) => {
  changeScope(FreezerStore.chooseRow.id.id, 'temp', temp).then((res) => {
    if (res === '') {
      ElMessage.success('修改成功')
    }
  })
}
</script>

<style scoped>
.drawer {
  background-color: #f9faff;
  height: 75vh;
  padding: 5px;
}
.el-row {
  width: 100%;
}
.el-form-item {
  margin-bottom: 0;
}
.el-image {
  height: 224px;
}
.center {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.minicard {
  line-height: 30px;
  display: flex;
}
.half {
  width: 50%;
}
.el-col {
  display: flex;
  align-items: stretch;
}
.col-div {
  width: 100%;
  display: block;
}
.drawerMap {
  height: 100%;
}
</style>
<style>
.el-tabs__content {
  margin: 0;
}
</style>
