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

const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
const object = {
  entityCountCmds: [
    {
      query: {
        entityFilter: {
          type: 'entityType',
          resolveMultiple: true,
          entityType: 'DEVICE',
        },
        keyFilters: [
          {
            key: {
              type: 'SERVER_ATTRIBUTE',
              key: 'active',
            },
            valueType: 'BOOLEAN',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: true,
                dynamicValue: null,
              },
              type: 'BOOLEAN',
            },
          },
        ],
      },
      cmdId: 1,
    },
    {
      query: {
        entityFilter: {
          type: 'entityType',
          resolveMultiple: true,
          entityType: 'DEVICE',
        },
        keyFilters: [
          {
            key: {
              type: 'SERVER_ATTRIBUTE',
              key: 'active',
            },
            valueType: 'BOOLEAN',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: false,
                dynamicValue: null,
              },
              type: 'BOOLEAN',
            },
          },
        ],
      },
      cmdId: 2,
    },
    {
      query: {
        entityFilter: {
          type: 'entityType',
          resolveMultiple: true,
          entityType: 'DEVICE',
        },
        keyFilters: [
          {
            key: {
              type: 'SHARED_ATTRIBUTE',
              key: 'enable',
            },
            valueType: 'BOOLEAN',
            predicate: {
              type: 'BOOLEAN',
              operation: 'EQUAL',
              value: { defaultValue: false },
            },
          },
        ],
      },
      cmdId: 3,
    },
  ],
}

const WebSocketAPI = () => {
  var token = MainStore.Login.token
  var webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
  webSocket.onopen = function () {
    var data = JSON.stringify(object)
    webSocket.send(data)
  }
  webSocket.onmessage = function (event) {
    var received_msg = JSON.parse(event.data)
    switch (received_msg.cmdId) {
      case 1:
        FreezerStore.totalFreezer[1].value = received_msg.count
        break
      case 2:
        FreezerStore.totalFreezer[0].value = FreezerStore.totalFreezer[1].value + received_msg.count
        break
      case 3:
        FreezerStore.totalFreezer[3].value = FreezerStore.totalFreezer[0].value - received_msg.count
        break
    }
  }
  // webSocket.onclose = function () {
  //   console.log('Connection is closed!')
  // }
}
WebSocketAPI()
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
</style>
