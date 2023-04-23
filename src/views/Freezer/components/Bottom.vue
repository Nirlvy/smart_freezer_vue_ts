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
    <el-table-column prop="deviceName" label="设备名称" min-width="160">
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
    <el-table-column label="资产所有" width="100" />
    <el-table-column label="设备厂商" />
    <el-table-column label="陈列">
      <template #default>
        <el-button disabled>查看</el-button>
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
    :page-sizes="[5, 10, 20]"
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
    <span v-else>{{ dialogValue[dialogValue.choose].title }} </span>
    <template #footer>
      <span>
        <el-button type="danger" @click="dialog = false">{{ dialogValue[dialogValue.choose].cancel }}</el-button>
        <el-button type="primary" @click="comfirmActivate">{{ dialogValue[dialogValue.choose].confirm }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { requestPage, getScope, devicesOperate, find, getDevicesInfo, updateDevice, getCustomerName } from '@/utils/commonRequset'
import { Link, Lock, ArrowDown, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import Drawer from './Drawer/index.vue'
import { changeScope } from '@/utils/commonRequset'

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
})
const formValue = reactive({
  org: [],
  ope: [],
  bus: [],
  shop: [],
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

const tableInit = () => {
  if (FreezerStore.freezerCard === '全部设备') {
    requestPage(data.pageSize, data.currentPage, false).then((res) => {
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

const rowData = computed(() => {
  return { getRowData }
})

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
  const release =
    out != undefined && check != undefined && act != undefined
      ? out
        ? '投放'
        : check
        ? act
          ? '回库'
          : '待激活'
        : '待检验'
      : check != undefined
      ? check && act != undefined
        ? '待投放'
        : ''
      : ''
  const secondButton = 'check' in scope && scope.check ? '激活' : '检验'
  const secondButtonDisable = release != '待激活' && release != '待检验'
  const thirdButton = 'assign' in scope && !scope.assign ? '分配' : '解绑'
  const thirdButtonDisable = release != '回库'
  return { imei, color, enable, release, secondButton, secondButtonDisable, thirdButton, thirdButtonDisable }
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

const comfirmActivate = () => {
  dialog.value = false
  if (dialogValue.choose === 'check' || dialogValue.choose === 'act') {
    changeScope(FreezerStore.chooseRow.id.id, dialogValue.choose, dialogValue.choose === 'check' ? 'SERVER' : 'SHARED', 1).then((res) => {
      if (res === '') {
        ElMessage.success('修改成功')
      }
      FreezerStore.chooseRow.SCOPE = { ...FreezerStore.chooseRow.SCOPE, [dialogValue.choose]: 1 }
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
