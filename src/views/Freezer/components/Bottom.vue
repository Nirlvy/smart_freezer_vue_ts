<template>
  <div class="tableHead">
    <div>
      <el-button type="primary">添加设备</el-button>
      <el-dropdown class="ml-10" @command="handleCommand">
        <el-button type="primary">
          批量操作
          <el-icon class="ml-10"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">导入设备</el-dropdown-item>
            <el-dropdown-item command="b">导出设备</el-dropdown-item>
            <el-dropdown-item command="c" divided>启用设备</el-dropdown-item>
            <el-dropdown-item command="d">停用设备</el-dropdown-item>
            <el-dropdown-item command="e">删除设备</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <el-input v-model="data.input" placeholder="请输入" style="width: 500px" clearable>
        <template #prepend>
          <el-select v-model="data.select" placeholder="Select" style="width: 115px">
            <el-option label="IMEI" value="IMEI" />
            <el-option label="资产编码" value="资产编码" />
            <el-option label="设备名称" value="设备名称" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="search" />
        </template>
      </el-input>
    </div>
  </div>
  <el-table :data="data.tableData" size="large" @selection-change="handleSelectionChange" @row-click="handleRowClick">
    <el-table-column fixed="left" type="selection" />
    <el-table-column prop="name" label="资产编码" min-width="140" />
    <el-table-column prop="deviceName" label="设备名称" min-width="100" />
    <el-table-column label="IMEI" min-width="150">
      <template #default="scope">
        {{ getImei(scope.row.SCOPE) }}
      </template>
    </el-table-column>
    <el-table-column prop="address" label="设备地址" min-width="200" show-overflow-tooltip />
    <el-table-column label="资产所有" width="100" />
    <el-table-column label="设备厂商" />
    <el-table-column label="陈列">
      <template #default>
        <el-button disabled>查看</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="状态" width="150">
      <template #default="scope">
        <el-icon :color="getColor(scope.row.SCOPE)">
          <Link />
        </el-icon>
        <el-icon v-if="getEnable(scope.row.SCOPE)" class="ml-5">
          <Lock />
        </el-icon>
        <span class="ml-5">{{ getRelease(scope.row.SCOPE) }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" prop="shelves" label="操作" width="350">
      <template #default="scope">
        <el-button size="small" @click="FreezerStore.drawer = true">详情</el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" plain>
          {{ getSecondButton(scope.row.SCOPE) }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" plain>
          {{ getThirdButton(scope.row.SCOPE) }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button :type="getEnable(scope.row.SCOPE) ? 'primary' : 'danger'" size="small" plain>
          {{ getEnable(scope.row.SCOPE) ? '启用' : '停用' }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="danger" size="small" plain>注销</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="ml-10 pu-10">
    <el-pagination
      v-model:current-page="data.currentPage"
      v-model:page-size="data.pageSize"
      :page-sizes="[5, 10, 20]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
      @size-change="tableInit"
      @current-change="tableInit"
    />
  </div>
  <Drawer />
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { requestPage, getScope, devicesOperate, find, getDevicesInfo } from '@/utils/commonRequset'
import { Link, Lock, ArrowDown, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, watch } from 'vue'
import Drawer from './Drawer/index.vue'

// const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
const data = reactive({
  tableData: [] as deviceInfo[],
  currentPage: 1,
  pageSize: 5,
  total: 0,
  importPage: false,
  chooseLine: [] as deviceInfo[],
  select: '',
  input: '',
})
// const object = {
//   tsSubCmds: [
//     {
//       entityType: 'DEVICE',
//       entityId: '009ef0c0-22fd-11ed-b8d0-f97a4e0c2279',
//       scope: 'LATEST_TELEMETRY',
//       keys: 'base.comm.pos.addr',
//       cmdId: 1,
//     },
//   ],
// }

const handleGetSharedScope = () => {
  data.tableData.forEach((item) => {
    getScope(item.id.id, 'page').then((res) => {
      if (!res) {
        return
      }
      console.log(res)
      item.SCOPE = res.reduce((acc, { key, value }) => {
        acc[key] = value
        return acc
      }, {})
    })
  })
}

// const WebSocketAPI = () => {
//   var token = MainStore.Login.token
//   var webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
//   webSocket.onopen = function () {
//     var data = JSON.stringify(object)
//     webSocket.send(data)
//   }
//   webSocket.onmessage = function (event) {
//     var received_msg = JSON.parse(event.data)
//     console.log(received_msg)
//     // switch (received_msg.cmdId) {
//     //   case 1:
//     //     FreezerStore.totalFreezer[1].value = received_msg.count
//     //     break
//     //   case 2:
//     //     FreezerStore.totalFreezer[0].value = FreezerStore.totalFreezer[1].value + received_msg.count
//     //     break
//     //   case 3:
//     //     FreezerStore.totalFreezer[3].value = FreezerStore.totalFreezer[0].value - received_msg.count
//     //     break
//     // }
//   }
//   // webSocket.onclose = function () {
//   //   console.log('Connection is closed!')
//   // }
// }
// WebSocketAPI()

const tableInit = () => {
  if (FreezerStore.freezerCard === '全部设备') {
    requestPage(data.pageSize, data.currentPage, false).then((res) => {
      if (!res) {
        return
      }
      data.tableData = res.data
      data.total = res.totalElements
      handleGetSharedScope()
    })
  } else {
    let type: 'Rep' | 'Shop' = 'Rep'
    switch (FreezerStore.freezerCard) {
      case '在库设备':
        type = 'Rep'
        break
      case '在店设备':
        type = 'Shop'
        break
    }
    find(data.pageSize, data.currentPage - 1, type).then((res) => {
      if (!res) {
        return
      }
      const deviceIds = res.data.map((item) => item.entityId.id)
      data.total = res.totalElements
      getDevicesInfo(deviceIds).then((res) => {
        if (!res) {
          return
        }
        data.tableData = res
        handleGetSharedScope()
        // WebSocketAPI()
      })
    })
  }
}
tableInit()

watch(
  () => FreezerStore.freezerCard,
  () => {
    data.tableData = []
    data.total = 0
    data.currentPage = 1
    tableInit()
  }
)

const getImei = (scope: SCOPE | undefined) => {
  if (scope && 'imei' in scope) {
    return scope.imei || ''
  }
}

const getColor = (scope: SCOPE | undefined) => {
  if (scope && 'active' in scope) {
    return scope.active ? 'green' : 'red'
  } else {
    return 'gray'
  }
}

const getEnable = (scope: SCOPE | undefined) => {
  if (scope && 'enable' in scope) {
    return scope.enable ? false : true
  }
  return true
}

const getRelease = (scope: SCOPE | undefined) => {
  if (!scope) {
    return
  }
  if (FreezerStore.freezerCard === '全部设备') {
    if ('out' in scope && 'check' in scope) {
      return scope.out ? '投放' : scope.check ? '回库' : '待检验'
    }
    if ('check' in scope) {
      return scope.check ? '待投放' : ''
    }
    return ''
  }
}

const getSecondButton = (scope: SCOPE | undefined) => {
  if (!scope) {
    return
  }
  if ('check' in scope && scope.check) {
    return '激活'
  }
  return '检验'
}

const getThirdButton = (scope: SCOPE | undefined) => {
  if (!scope) {
    return
  }
  if ('assign' in scope && !scope.assign) {
    return '分配'
  }
  return '解绑'
}

const handleCommand = async (command: string) => {
  if (command === 'a') {
    data.importPage = true
    return
  }
  if (data.chooseLine.length === 0) {
    ElMessage.info('请至少选择一列')
    return
  }
  const deviceIds = data.chooseLine.map((item) => item.id.id).join(',')
  switch (command) {
    case 'b':
      devicesOperate(deviceIds, 'export')
      break
    case 'c':
      if (await devicesOperate(deviceIds, 'enable')) {
        tableInit()
      }
      break
    case 'd':
      if (await devicesOperate(deviceIds, 'disable')) {
        tableInit()
      }
      break
    case 'e':
      if (await devicesOperate(deviceIds, 'delete')) {
        tableInit()
      }
      break
  }
}

const handleSelectionChange = (val: deviceInfo[]) => {
  data.chooseLine = val
}

const handleRowClick = (row: deviceInfo) => {
  FreezerStore.chooseRow = row
}

const search = () => {
  if (!data.select || !data.input) {
    return
  }
  switch (data.select) {
    case 'IMEI':
      find(data.pageSize, 0, 'IMEI', data.input).then((res) => {
        if (!res || res.data.length === 0) {
          data.tableData = []
          data.currentPage = 1
          data.total = 0
          return
        }
        const deviceIds = res.data.map((item) => item.entityId.id)
        data.total = res.totalElements
        getDevicesInfo(deviceIds).then((res) => {
          if (!res) {
            return
          }
          data.tableData = res
          data.total = res.length
          handleGetSharedScope()
        })
      })
      break
    case '资产编码':
      requestPage(data.pageSize, 1, false, data.input).then((res) => {
        if (!res || res.data.length === 0) {
          data.tableData = []
          data.currentPage = 1
          data.total = 0
          return
        }
        data.tableData = res.data
        data.total = res.totalElements
        handleGetSharedScope()
      })
      break
    case '设备名称':
      requestPage(data.pageSize, 1, true, data.input).then((res) => {
        if (!res || res.data.length === 0) {
          data.tableData = []
          data.currentPage = 1
          data.total = 0
          return
        }
        data.tableData = res.data
        data.total = res.totalElements
        handleGetSharedScope()
      })
      break
  }
}
</script>

<style scoped>
.tableHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9faff;
  width: 100%;
  padding: 10px;
}
</style>
