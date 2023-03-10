<template>
  <el-card class="firstCard row">
    <div class="card-title">信息</div>
    <el-row :gutter="5">
      <el-col :span="8">
        <div class="tone">
          <el-icon :size="52" color="#FE7179">
            <Refrigerator />
          </el-icon>
          <div class="card-text">{{ inforList[0].name }}</div>
          <div class="card-text">{{ inforList[0].value }}</div>
        </div>
      </el-col>
      <el-col
        v-for="(item, index) in inforList.slice(1)"
        :key="index"
        :span="8"
      >
        <div class="tone">
          <el-progress
            type="circle"
            :percentage="
              Math.floor((item.value * 100) / FreezerStore.cardValue.total)
                ? Math.floor((item.value * 100) / FreezerStore.cardValue.total)
                : 0
            "
            :width="52"
            :color="colors"
          />
          <div class="card-text">{{ item.name }}</div>
          <div class="card-text">{{ item.value }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="secondCard row">
    <div class="card-title">代办中心</div>
    <ul>
      <li v-for="(item, index) in centerList" :key="index">
        <span>{{ item.name }}</span>
        <span class="value">{{ item.value }}</span>
      </li>
    </ul>
  </el-card>
  <el-card class="thirdCard row">
    <div class="card-title">帮助中心</div>
    <div v-for="(item, index) in helpList" :key="index" class="card-line">
      <span>
        <el-icon class="helpIcon">
          <component :is="item.icon" />
        </el-icon>
        {{ item.name }}
      </span>
      <span>
        <el-icon><ArrowRightBold /></el-icon>
      </span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import { useFreezerStore, useMainStore } from '@/store/store'
import {
  ChatRound,
  ArrowRightBold,
  Refrigerator,
} from '@element-plus/icons-vue'
import { ref, computed, markRaw, reactive } from 'vue'

const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
// const deviceInfos = ref<deviceInfos>()
const entitiesQuery = ref<entitiesQueryFind>()
const inforList = computed(() => [
  {
    name: '设备总数',
    value: FreezerStore.cardValue.total,
  },
  {
    name: '在线设备',
    value: FreezerStore.cardValue.online,
  },
  {
    name: '投放设备',
    value: FreezerStore.cardValue.release,
  },
  {
    name: '启用设备',
    value: FreezerStore.cardValue.enable,
  },
  {
    name: '设备告警率',
    value: FreezerStore.cardValue.warn,
  },
  {
    name: '纯净率',
    value: FreezerStore.cardValue.pure,
  },
])
const centerList = reactive([
  { name: '仓库代办', value: 0 },
  { name: '生产代办', value: 0 },
  { name: '采购代办', value: 0 },
  { name: '销售代办', value: 0 },
])
const helpList = reactive([
  { icon: markRaw(ChatRound), name: '新手帮助' },
  { icon: markRaw(ChatRound), name: '在线帮助' },
  { icon: markRaw(ChatRound), name: '视频教程' },
  { icon: markRaw(ChatRound), name: '流程图' },
])
const findPara = {
  entityFilter: {
    type: 'entityType',
    entityType: 'DEVICE',
  },
  keyFilters: [
    {
      key: {
        type: 'ATTRIBUTE',
        key: 'out',
      },
      valueType: 'NUMERIC',
      predicate: {
        operation: 'EQUAL',
        value: {
          defaultValue: 1,
          dynamicValue: null,
        },
        type: 'NUMERIC',
      },
    },
  ],
  pageLink: {
    page: 0,
    pageSize: 2147483647,
    sortOrder: {
      property: 'createdTime',
      direction: 'DESC',
    },
  },
}
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
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const WebSocketAPI = () => {
  var token = MainStore.Login.token
  // var entityId = "f845ced0-13bb-11ed-8e3b-8905497b0a79";
  var webSocket = new WebSocket(
    'ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token
  )
  webSocket.onopen = function () {
    var data = JSON.stringify(object)
    webSocket.send(data)
  }
  webSocket.onmessage = function (event) {
    var received_msg = JSON.parse(event.data)
    switch (received_msg.cmdId) {
      case 1:
        FreezerStore.cardValue.online = received_msg.count
        break
      case 2:
        FreezerStore.cardValue.total =
          FreezerStore.cardValue.online + received_msg.count
        break
      case 3:
        FreezerStore.cardValue.enable =
          FreezerStore.cardValue.total - received_msg.count
        break
    }
  }
  // webSocket.onclose = function () {
  //   console.log('Connection is closed!')
  // }
}

const init = () => {
  request.get<USER & E>('/user/' + MainStore.Jwt.userId).then((res) => {
    if (res.data.status) {
      return
    }
    MainStore.User = res.data
  })
  // request
  //   .get<deviceInfos & E>('/tenant/deviceInfos?pageSize=2147483647&page=0')
  //   .then((res) => {
  //     if (res.data.status) {
  //       return
  //     }
  //     deviceInfos.value = res.data
  //     FreezerStore.cardValue.total = res.data.totalElements
  //   })
  request
    .post<entitiesQueryFind & E>('/entitiesQuery/find', findPara)
    .then((res) => {
      if (res.data.status) {
        return
      }
      entitiesQuery.value = res.data
      FreezerStore.cardValue.release = res.data.totalElements
      // entitiesQuery.value.data.forEach((item, index) => {
      //   request.get<deviceInfo>('/device/info/' + item[index].entityId.id)
      // })
    })
  WebSocketAPI()
}
init()
</script>

<style scoped>
.firstCard {
  height: 254.58px;
}
.secondCard,
.thirdCard {
  flex: 1;
}
.tone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
}
ul {
  margin: 10px -10px;
}
li {
  margin-bottom: 20px;
}
.value {
  float: right;
  margin-right: 10%;
}
.card-line {
  display: flex;
  justify-content: space-between;
  margin: 10px 5px;
}
.helpIcon {
  margin-right: 10px;
}
</style>
