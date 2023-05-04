<template>
  <div class="tableHead">
    <div>
      <el-button type="primary" @click="getDevicesProfile">添加设备</el-button>
      <el-dropdown class="ml-10" @command="handleCommand">
        <el-button type="primary">
          批量操作
          <el-icon class="ml-10"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="a">导入设备</el-dropdown-item>
            <el-dropdown-item command="b">导出设备</el-dropdown-item> -->
            <el-dropdown-item command="c">启用设备</el-dropdown-item>
            <el-dropdown-item command="d">停用设备</el-dropdown-item>
            <el-dropdown-item command="e">删除设备</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <el-input v-model="data.input" placeholder="请输入" style="width: 500px" clearable @clear="searchClear">
        <template #prepend>
          <el-select v-model="data.select" placeholder="Select" style="width: 115px">
            <el-option label="IMEI" value="IMEI" />
            <el-option label="资产编码" value="资产编码" />
            <el-option label="设备名称" value="设备名称" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" :disabled="!data.select || !data.input" @click="search" />
        </template>
      </el-input>
    </div>
  </div>
  <el-table :data="data.tableData" size="large" @selection-change="handleSelectionChange" @row-click="handleRowClick">
    <el-table-column fixed="left" type="selection" />
    <el-table-column prop="name" label="资产编码" min-width="140" />
    <el-table-column prop="deviceName" label="设备名称" min-width="100">
      <template #default="scope">
        <el-button v-if="!nameSet" type="primary" link @click="nameSet = !nameSet">{{ scope.row.deviceName }}­</el-button>
        <span v-else>
          <el-input v-model="scope.row.deviceName" style="width: 70px" />
          <el-button class="ml-10" type="primary" size="small" @click="nameSave">确定</el-button>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="IMEI" min-width="150">
      <template #default="scope">
        {{ rowData.getRowData(scope.row.SCOPE)?.imei }}
      </template>
    </el-table-column>
    <el-table-column prop="address" label="设备地址" min-width="200" show-overflow-tooltip />
    <el-table-column label="资产所有" min-width="100" />
    <el-table-column label="设备厂商" min-width="100" />
    <el-table-column label="陈列">
      <template #default>
        <el-button size="small" disabled>查看</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="状态" width="150">
      <template #default="scope">
        <el-icon :color="rowData.getRowData(scope.row.SCOPE)?.color">
          <Link />
        </el-icon>
        <el-icon v-if="rowData.getRowData(scope.row.SCOPE)?.enable" class="ml-5">
          <Lock />
        </el-icon>
        <span class="ml-5">{{ rowData.getRowData(scope.row.SCOPE)?.release }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" prop="shelves" label="操作" width="350">
      <template #default="scope">
        <el-button size="small" @click="openDrawer">详情</el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" :disabled="rowData.getRowData(scope.row.SCOPE)?.secondButtonDisable" plain @click="secondClick">
          {{ rowData.getRowData(scope.row.SCOPE)?.secondButton }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" :disabled="rowData.getRowData(scope.row.SCOPE)?.thirdButtonDisable" plain @click="thirdClick">
          {{ rowData.getRowData(scope.row.SCOPE)?.thirdButton }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button :type="rowData.getRowData(scope.row.SCOPE)?.enable ? 'primary' : 'danger'" size="small" plain @click="fourthClick">
          {{ rowData.getRowData(scope.row.SCOPE)?.enable ? '启用' : '停用' }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="danger" size="small" plain>注销</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="data.currentPage"
    v-model:page-size="data.pageSize"
    class="ml-10 pu-10"
    :page-sizes="[5, 8, 10, 20]"
    :background="true"
    layout="total, sizes, prev, pager, next, jumper"
    :total="data.total"
    @size-change="tableInit"
    @current-change="tableInit"
  />
  <Drawer />
  <el-dialog v-model="dialog" title="Tips" width="400px">
    <el-form v-if="dialogValue.choose === 'distribution'">
      <el-form-item label="组织机构:"><el-cascader v-model="formValue.org" :options="options" /></el-form-item>
      <el-form-item label="运维人员:"><el-cascader v-model="formValue.ope" :options="options" /></el-form-item>
      <el-form-item label="业务人员:"><el-cascader v-model="formValue.bus" :options="options" /></el-form-item>
      <el-form-item label="店主:"><el-cascader v-model="formValue.shop" :options="options" /></el-form-item>
    </el-form>
    <el-form v-else-if="dialogValue.choose === 'addDevice'" ref="ruleFormRef" :model="formValue" :rules="rules">
      <el-form-item label="设备编号:" prop="deviceId"><el-input v-model="formValue.deviceId" style="width: 225px" /></el-form-item>
      <el-form-item label="设备配置:" prop="disposition">
        <el-select v-model="formValue.disposition">
          <el-option v-for="item in formValue.options" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
    </el-form>
    <span v-else>{{ dialogValue[dialogValue.choose].title }}</span>
    <template #footer>
      <span>
        <el-button type="danger" @click="dialog = false">{{ dialogValue[dialogValue.choose].cancel }}</el-button>
        <el-button type="primary" @click="comfirmActivate">{{ dialogValue[dialogValue.choose].confirm }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useFreezerStore, useMainStore } from '@/store/store'
import {
  requestPage,
  getScope,
  devicesOperate,
  find,
  getDevicesInfo,
  updateDevice,
  getCustomerName,
  getDeviceProfileInfos,
  changeScope,
  addDevice,
} from '@/utils/commonRequset'
import { Link, Lock, ArrowDown, Search } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import Drawer from './Drawer/index.vue'

const MainStore = useMainStore()
const FreezerStore = useFreezerStore()
const data = reactive({
  tableData: [] as deviceInfo[],
  currentPage: 1,
  pageSize: 8,
  total: 0,
  importPage: false,
  chooseLine: [] as deviceInfo[],
  select: '',
  input: '',
})
const nameSet = ref(false)
const dialog = ref(false)
const dialogValue = reactive({
  choose: '',
  check: {
    title: '请确认检验是否合格',
    cancel: '不合格',
    confirm: '合格',
  },
  act: {
    title: '你确定要激活该设备吗?',
    cancel: '取消',
    confirm: '确定',
  },
  enable: {
    title: '你确定要启用该设备吗?',
    cancel: '取消',
    confirm: '确定',
  },
  disable: {
    title: '你确定要停用该设备吗?',
    cancel: '取消',
    confirm: '确定',
  },
  addDevice: {
    title: '添加设备',
    cancel: '取消',
    confirm: '确定',
  },
})
const formValue = reactive({
  org: [],
  ope: [],
  bus: [],
  shop: [],
  deviceId: '',
  options: [] as { id: { entityType: string; id: string }; name: string }[],
  disposition: '',
})
const chooseValue = ref<Option>()

const handleGetSharedScope = () => {
  data.tableData.forEach((item) => {
    getScope(item.id.id, 'page').then((res) => {
      if (!res) {
        return
      }
      item.SCOPE = res.reduce((acc, { key, value }) => {
        acc[key] = value
        return acc
      }, {})
    })
  })
}

const WebSocketAPI = () => {
  let token = MainStore.Login.token
  let webSocket = new WebSocket('ws://124.222.184.107/api/ws/plugins/telemetry?token=' + token)
  webSocket.onopen = function () {
    for (let i = 0; i < data.tableData.length; i++) {
      const object = {
        tsSubCmds: [{ entityType: 'DEVICE', entityId: data.tableData[i].id.id, scope: 'LATEST_TELEMETRY', cmdId: i + 4 }],
      }
      webSocket.send(JSON.stringify(object))
    }
  }
  webSocket.onmessage = function (event) {
    let received_msg = JSON.parse(event.data)
    if (received_msg.subscriptionId >= 4) {
      data.tableData[received_msg.subscriptionId - 4].address = received_msg.data['base.comm.pos.addr']
        ? received_msg.data['base.comm.pos.addr'][0][1]
        : ''
      data.tableData[received_msg.subscriptionId - 4].latitude = received_msg.data['base.comm.pos.lat']
        ? received_msg.data['base.comm.pos.lat'][0][1]
        : ''
      data.tableData[received_msg.subscriptionId - 4].longitude = received_msg.data['base.comm.pos.lon']
        ? received_msg.data['base.comm.pos.lon'][0][1]
        : ''
    }
  }
}

const tableInit = () => {
  if (FreezerStore.freezerCard === '全部设备') {
    requestPage(data.pageSize, data.currentPage, data.select === '设备名称', data.input).then((res) => {
      if (!res) {
        return
      }
      const newData = res.data.map((item) => ({
        ...item,
        deviceName: item.deviceName === null || item.deviceName === '' ? '无' : item.deviceName,
      }))
      data.tableData = newData
      data.total = res.totalElements
      handleGetSharedScope()
      WebSocketAPI()
    })
  } else {
    if (FreezerStore.totalFreezer[FreezerStore.freezerCard] == 0) {
      data.tableData = []
      data.total = 0
    } else {
      find(data.pageSize, data.currentPage - 1, FreezerStore.freezerCard, FreezerStore.freezerCard === 'IMEI' ? data.input : undefined).then(
        (res) => {
          if (!res) {
            return
          }
          const deviceIds = res.data.map((item) => item.entityId.id)
          data.total = res.totalElements
          FreezerStore.totalFreezer[FreezerStore.freezerCard] = res.totalElements
          if (deviceIds.length === 0) return
          getDevicesInfo(deviceIds).then((res) => {
            if (!res) {
              return
            }
            const newData = res.map((item) => ({
              ...item,
              deviceName: item.deviceName === null || item.deviceName === '' ? '无' : item.deviceName,
            }))
            data.tableData = newData
            handleGetSharedScope()
            WebSocketAPI()
          })
        }
      )
    }
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

const rowData = computed(() => {
  return { getRowData }
})

const getRelease = (out, check, act, assign) => {
  if (check == -1) {
    return '不达标'
  }
  if (check == 0) {
    return '待检验'
  }
  if (act && assign && check && !out) {
    return '待投放'
  }
  if (act && assign && check && out) {
    return '投放'
  }
  if (!act && !assign && check && !out) {
    return '待激活'
  }
  if (act && !assign && check && !out) {
    return '回库'
  }
  return ''
}

const getRowData = (scope: SCOPE | undefined) => {
  if (!scope) {
    return
  }
  const imei = 'imei' in scope ? scope.imei : ''
  const color = 'active' in scope ? (scope.active ? 'green' : 'red') : 'gray'
  const enable = 'enable' in scope ? !scope.enable : true
  const out = 'out' in scope ? scope.out : undefined
  const act = 'act' in scope ? scope.act : undefined
  const check = 'check' in scope ? scope.check : undefined
  const assign = 'assign' in scope ? scope.assign : undefined
  const release = getRelease(out, check, act, assign)
  const secondButton = 'check' in scope && scope.check ? '激活' : '检验'
  const secondButtonDisable = release != '待激活' && release != '待检验'
  const thirdButton = 'assign' in scope && !scope.assign ? '分配' : '解绑'
  const thirdButtonDisable = release != '回库'
  return { imei, color, enable, release, secondButton, secondButtonDisable, thirdButton, thirdButtonDisable }
}

const handleCommand = async (command: string) => {
  // if (command === 'a') {
  //   data.importPage = true
  //   return
  // }
  if (data.chooseLine.length === 0) {
    ElMessage.info('请至少选择一列')
    return
  }
  const deviceIds = data.chooseLine.map((item) => item.id.id).join(',')
  switch (command) {
    // case 'b':
    //   devicesOperate(deviceIds, 'export')
    //   break
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
  switch (data.select) {
    case 'IMEI':
      if (FreezerStore.freezerCard == 'IMEI') {
        tableInit()
        return
      }
      FreezerStore.freezerCard = 'IMEI'
      break
    case '资产编码':
      if (FreezerStore.freezerCard == '全部设备') {
        tableInit()
        return
      }
      FreezerStore.freezerCard = '全部设备'
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

const openDrawer = () => {
  setTimeout(() => {
    FreezerStore.drawer = true
  }, 1)
}

const nameSave = () => {
  setTimeout(() => {
    updateDevice().then((res) => {
      if (res) {
        ElMessage.success('修改成功')
      }
    })
    nameSet.value = false
  }, 1)
}

const comfirmActivate = async () => {
  dialog.value = false
  if (dialogValue.choose === 'check' || dialogValue.choose === 'act') {
    changeScope(FreezerStore.chooseRow.id.id, dialogValue.choose, dialogValue.choose === 'check' ? 'SERVER' : 'SHARED', 1).then((res) => {
      if (res === '') {
        ElMessage.success('修改成功')
      }
      FreezerStore.chooseRow.SCOPE = { ...FreezerStore.chooseRow.SCOPE, [dialogValue.choose]: 1 }
    })
  } else {
    if (dialogValue.choose === 'addDevice') {
      if (formValue.deviceId == '' || formValue.deviceId == null || formValue.disposition == '' || formValue.disposition == null) {
        ElMessage.error('不能为空!')
        return
      }
      let name = formValue.options.find((item) => item.name === formValue.disposition)
      if (name == undefined) {
        return
      }
      addDevice(name.id.id, formValue.deviceId).then((res) => {
        if (res) {
          ElMessage.success('添加成功')
          tableInit()
        }
      })
    } else {
      devicesOperate(FreezerStore.chooseRow.id.id, dialogValue.choose).then((res) => {
        if (res === '') {
          ElMessage.success('修改成功')
        }
        FreezerStore.chooseRow.SCOPE = { ...FreezerStore.chooseRow.SCOPE, enable: dialogValue.choose === 'enable' ? 1 : 0 }
      })
    }
  }
}

const secondClick = (event) => {
  const text = event.target.textContent
  if (text === '检验') {
    dialogValue.choose = 'check'
  } else {
    dialogValue.choose = 'act'
  }
  dialog.value = true
}

function convertToOptions(data: (customerName & E)[]): Option[] {
  const options: Option[] = []
  for (const item of data) {
    const option: Option = {
      value: item.customerName ?? '',
      label: item.customerName ?? '',
    }
    if (item.children) {
      option.children = convertToOptions(item.children)
    }
    options.push(option)
  }
  return options
}

const thirdClick = (event) => {
  const text = event.target.textContent
  if (text === '分配') {
    getCustomerName().then((res) => {
      if (res) {
        for (const item of res) {
          const option: Option = {
            value: item.customerName ?? '',
            label: item.customerName ?? '',
          }
          if (item.children) {
            option.children = convertToOptions(item.children)
          }
          options.push(option)
        }
        chooseValue.value = res.map((item) => {
          return {
            customerName: item.customerName,
            children: item.children,
          }
        })
        dialogValue.choose = 'distribution'
        dialog.value = true
      }
    })
  }
}

const fourthClick = (event) => {
  const text = event.target.textContent
  if (text === '启用') {
    dialogValue.choose = 'enable'
  } else {
    dialogValue.choose = 'disable'
  }
  dialog.value = true
}

const getDevicesProfile = () => {
  getDeviceProfileInfos().then((res) => {
    if (!res) {
      return
    }
    formValue.options = res.data.map((item) => ({ id: item.id, name: item.name }))
    dialogValue.choose = 'addDevice'
    dialog.value = true
  })
}

const searchClear = () => {
  FreezerStore.freezerCard = FreezerStore.firstCard
  tableInit()
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
