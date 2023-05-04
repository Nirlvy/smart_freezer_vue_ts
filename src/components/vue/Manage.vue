<template>
  <el-container class="layout-container">
    <el-header>
      <Header />
    </el-header>

    <el-container>
      <el-container>
        <el-aside>
          <Aside />
        </el-aside>
      </el-container>

      <el-container class="main">
        <Breadcrumb />
        <el-main>
          <router-view />
          <MqttDialog />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useFreezerStore, useMainStore } from '@/store/store'

import MqttDialog from './MqttDialog.vue'
import { ElNotification } from 'element-plus'
import { h } from 'vue'
import { getScopeParam } from '../ts/scope'
import mqtt from 'paho-mqtt'
import { productUpdate } from '@/utils/commonRequset2'

const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
const object = {
  entityCountCmds: [
    {
      query: {
        ...getScopeParam('websocket', '在线设备'),
      },
      cmdId: 1,
    },
    {
      query: {
        ...getScopeParam('websocket', '离线设备'),
      },
      cmdId: 2,
    },
    {
      query: {
        ...getScopeParam('websocket', '启用设备'),
      },
      cmdId: 3,
    },
    {
      query: {
        ...getScopeParam('websocket', '停用设备'),
      },
      cmdId: 4,
    },
    {
      query: {
        ...getScopeParam('websocket', '投放设备'),
      },
      cmdId: 5,
    },
    {
      query: {
        ...getScopeParam('websocket', '通电设备'),
      },
      cmdId: 6,
    },
  ],
}

const WebSocketAPI = () => {
  let token = MainStore.Login.token
  let webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
  webSocket.onopen = function () {
    let data = JSON.stringify(object)
    webSocket.send(data)
  }
  webSocket.onmessage = function (event) {
    let received_msg = JSON.parse(event.data)
    switch (received_msg.cmdId) {
      case 1:
        FreezerStore.totalFreezer['在线设备'] = received_msg.count
        break
      case 2:
        FreezerStore.totalFreezer['离线设备'] = received_msg.count
        FreezerStore.totalFreezer['全部设备'] = FreezerStore.totalFreezer['在线设备'] + received_msg.count
        break
      case 3:
        FreezerStore.totalFreezer['启用设备'] = received_msg.count
        break
      case 4:
        FreezerStore.totalFreezer['停用设备'] = received_msg.count
        break
      case 5:
        FreezerStore.totalFreezer['投放设备'] = received_msg.count
        break
      case 6:
        FreezerStore.totalFreezer['通电设备'] = received_msg.count
        break
    }
  }
}

const mqttAPI = () => {
  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('MQTT连接已断开：' + responseObject.errorMessage)
      client.connect({
        onSuccess: () => {
          client.subscribe('realtime')
        },
        keepAliveInterval: 60,
      })
    }
  }
  client.connect({
    onSuccess: () => {
      client.subscribe('realtime')
    },
    keepAliveInterval: 60,
  })
  client.onMessageArrived = (message) => {
    if (message.destinationName === 'realtime') {
      MainStore.imgBase64 = ['data:image/jpeg;base64,' + message.payloadString.split('-')[0], message.payloadString.split('-')[1].split(/\s+/)[2]]
      ElNotification({
        title: '一个新售出',
        dangerouslyUseHTMLString: true,
        duration: 10000,
        message: h('p', [
          '售出了' + ' ' + MainStore.imgBase64[1] + ' ',
          h(
            'el-button',
            {
              style: { color: '#409EFF' },
              onclick: () => {
                MainStore.dialog = true
              },
            },
            '点击查看'
          ),
        ]),
      })
    }
    productUpdate(MainStore.imgBase64[1])
  }
}

WebSocketAPI()
setTimeout(() => {
  mqttAPI()
}, 500)
</script>
<script lang="ts">
export const client = new mqtt.Client('8.130.47.235', 8000, 'nirlvy')
</script>

<style scoped>
.el-header {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.el-aside {
  width: auto;
  flex-basis: 0;
  flex-grow: 1;
}
.layout-container .el-main {
  margin: 0;
  padding: 0;
}
.main {
  height: 100%;
  width: 100%;
  flex-direction: column;
}
</style>

<style>
.bg {
  display: flex;
  background-color: #f3f5f6;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  overflow: hidden;
  margin-bottom: 50px;
}
.el-card__body {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.el-card:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
}
</style>
