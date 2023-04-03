<template>
  <div class="bg">
    <el-card class="mb-10">
      <el-row :gutter="5">
        <el-col :span="10">
          <div class="flex">
            <el-image :src="'../../../src/assets/img/test1.png'" />
            <el-form class="ml-10" :model="profile">
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
            <el-form class="ml-10" :model="profile">
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
            <el-button type="success" :disabled="FreezerStore.chooseRow.SCOPE?.find((item) => item.key === 'enable')?.value">激活</el-button>
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
        <el-row>
          <el-col :span="9">
            <el-card class="minicard">
              <span>
                <el-icon color="#3989F5"><InfoFilled /></el-icon> 温度
              </span>
              <span>柜内温度:{{ data.temp }}</span>
              <span>环境温度:{{ data.temp2 }}</span>
              <span>蒸发温度:{{ data.temp3 }}</span>
              <span>冷凝温度:{{ data.temp4 }}</span>
            </el-card>
          </el-col>
          <el-col :span="5"></el-col>
          <el-col :span="5"></el-col>
          <el-col :span="5"></el-col>
        </el-row>
      </el-col>
      <el-col :span="6">a</el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useFreezerStore, useMainStore } from '@/store/store'
import { getDeviceProfile, getScope, modeSwitch } from '@/utils/commonRequset'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const FreezerStore = useFreezerStore()
const MainStore = useMainStore()
const profile = ref<deviceProfile>()
const info = ref<scope[]>()
const workMode = ['制冷', '制热', '冷热']
const workModeNum = ref('')
const runMode = ['常规', '节能', '智能']
const runModeNum = ref('')
const data = reactive({
  temp: 0,
  temp2: 0,
  temp3: 0,
  temp4: 0,
})

onMounted(() => {
  setTimeout(() => init(), 1)
})

const init = async () => {
  WebSocketAPI()
  await getDeviceProfile(FreezerStore.chooseRow.deviceProfileId.id).then((res) => {
    if (!res) return
    profile.value = res
  })
  await getScope(FreezerStore.chooseRow.id.id, 'info').then((res) => {
    if (!res) return
    info.value = res
  })
  workModeNum.value = workMode[Number(info.value?.find((item) => item.key === 'base.core.frhCtrl.mode')?.value)]
  runModeNum.value = runMode[Number(info.value?.find((item) => item.key === 'base.core.frhCtrl.type')?.value)]
}

const modeChange = (mode: 'work' | 'run') => {
  const index = mode === 'work' ? workMode.indexOf(workModeNum.value) : runMode.indexOf(runModeNum.value)
  modeSwitch(FreezerStore.chooseRow.id.id, index, mode).then((res) => {
    if (res === '') {
      ElMessage.success('修改成功')
    }
  })
}

const WebSocketAPI = () => {
  var token = MainStore.Login.token
  var webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
  webSocket.onopen = function () {
    const object = {
      attrSubCmds: [],
      tsSubCmds: [
        {
          entityType: 'DEVICE',
          entityId: FreezerStore.chooseRow.id.id,
          scope: 'LATEST_TELEMETRY',
          cmdId: 1,
        },
      ],
      historyCmds: [],
      entityDataCmds: [],
      entityDataUnsubscribeCmds: [],
      alarmDataCmds: [],
      alarmDataUnsubscribeCmds: [],
      entityCountCmds: [],
      entityCountUnsubscribeCmds: [],
    }
    var data = JSON.stringify(object)
    webSocket.send(data)
  }
  webSocket.onmessage = function (event) {
    var received_msg = JSON.parse(event.data)
    console.log(received_msg['data'])
    data.temp = received_msg['data']['base.core.frhCtrl.temp.val'][0][1]
    data.temp2 = received_msg['data']['base.core.frhCtrl.temp4.val'][0][1]
    data.temp3 = received_msg['data']['base.core.frhCtrl.temp2.val'][0][1]
    data.temp4 = received_msg['data']['base.core.frhCtrl.temp3.val'][0][1]
  }
}
</script>

<style scoped>
.bg {
  background-color: #f9faff;
  height: 75vh;
  display: block;
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
}
</style>
<style>
.el-tabs__content {
  margin: 0;
}
</style>
