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
    <el-table-column prop="name" label="资产编码" width="150" />
    <el-table-column prop="deviceName" label="设备名称" width="100" />
    <el-table-column prop="capacity" label="IMEI" />
    <el-table-column prop="address" label="设备地址" width="200" show-overflow-tooltip />
    <el-table-column prop="shelves" label="设备厂商" width="100" />
    <el-table-column prop="shelves" label="瓶装厂" />
    <el-table-column prop="shelves" label="省" />
    <el-table-column prop="shelves" label="市" />
    <el-table-column prop="shelves" label="业代" />
    <el-table-column prop="shelves" label="业务所" />
    <el-table-column prop="shelves" label="代理电话" width="100" />
    <el-table-column prop="shelves" label="仓库" />
    <el-table-column prop="shelves" label="仓库地址" width="100" />
    <el-table-column prop="shelves" label="客户形态" width="100" />
    <el-table-column prop="shelves" label="客户地址" width="100" />
    <el-table-column prop="shelves" label="购入日期" width="100" />
    <el-table-column prop="shelves" label="陈列" />
    <el-table-column fixed="right" prop="SHARED_SCOPE" label="状态" width="150">
      <template #default="scope">
        <el-icon :color="getColor(scope.row.SHARED_SCOPE)">
          <Link />
        </el-icon>
        <el-icon v-if="getEnable(scope.row.SHARED_SCOPE)" class="ml-5">
          <Lock />
        </el-icon>
        <span class="ml-5">{{ getRelease(scope.row.SHARED_SCOPE) }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" prop="shelves" label="操作" width="350">
      <template #default="scope">
        <el-button size="small" @click="data.drawer = true">详情</el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" plain>
          {{ getSecondButton(scope.row.SHARED_SCOPE) }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" size="small" plain>
          {{ getThirdButton(scope.row.SHARED_SCOPE) }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button :type="scope.row.SHARED_SCOPE?.find((item) => item.key === 'enable')?.value ? 'danger' : 'primary'" size="small" plain>
          {{ scope.row.SHARED_SCOPE?.find((item) => item.key === 'enable')?.value ? '停用' : '启用' }}
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
  <el-drawer v-model="data.drawer" title="详情" size="60%">
    <Drawer />
  </el-drawer>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { requestPage, getSharedScope, devicesOperate, find, getDevicesInfo } from '@/utils/commonRequset'
import { Link, Lock, ArrowDown, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, watch } from 'vue'
import Drawer from './Drawer/index.vue'

const FreezerStore = useFreezerStore()
const data = reactive({
  tableData: [] as deviceInfo[],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  importPage: false,
  chooseLine: [] as deviceInfo[],
  select: '',
  input: '',
  drawer: false,
})

const handleGetSharedScope = () => {
  data.tableData.forEach((item) => {
    getSharedScope(item.id.id).then((res) => {
      if (!res) {
        return
      }
      item.SHARED_SCOPE = res
    })
  })
}

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

const getColor = (sharedscope: sharedScope[] | undefined) => {
  if (sharedscope) {
    return sharedscope.find((item) => item.key === 'active')?.value ? 'green' : 'red'
  } else {
    return 'gray'
  }
}

const getEnable = (sharedscope: sharedScope[] | undefined) => {
  if (sharedscope) {
    return sharedscope.find((item) => item.key === 'enable')?.value ? false : true
  }
}

const getRelease = (sharedscope: sharedScope[] | undefined) => {
  if (!sharedscope) {
    return
  }
  if (FreezerStore.freezerCard === '全部设备') {
    return sharedscope.find((item) => item.key === 'out')?.value ? '投放' : sharedscope.find((item) => item.key === 'assign') ? '待投放' : '回库'
  } else if (FreezerStore.freezerCard === '在库设备') {
    return sharedscope.find((item) => item.key === 'check')?.value ? '回库' : '待检验'
  } else {
    return sharedscope.find((item) => item.key === 'out')?.value ? '投放' : '待投放'
  }
}

const getSecondButton = (sharedscope: sharedScope[] | undefined) => {
  if (!sharedscope) {
    return
  }
  switch (FreezerStore.freezerCard) {
    case '全部设备':
      return '激活'
    case '在库设备':
      return sharedscope.find((item) => item.key === 'check')?.value ? '激活' : '检验'
    case '在店设备':
      return '激活'
  }
}

const getThirdButton = (sharedscope: sharedScope[] | undefined) => {
  if (!sharedscope) {
    return
  }
  switch (FreezerStore.freezerCard) {
    case '全部设备':
      return sharedscope.find((item) => item.key === 'enable')?.value ? '解绑' : '分配'
    case '在库设备':
      return '分配'
    case '在店设备':
      return '解绑'
  }
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
