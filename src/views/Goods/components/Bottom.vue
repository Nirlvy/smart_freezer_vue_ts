<template>
  <div class="tableHead">
    <div class="headLine">
      <el-input v-model="input.name" class="input" placeholder="商品名称" width="200" clearable />
      <el-input v-model="input.number" class="input ml-10" placeholder="资产编码" clearable />
      <div class="picker ml-10">
        <el-date-picker
          v-model="input.time"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      <el-button class="ml-10" type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </div>
    <div class="headLine">
      <el-button text @click="switchTableMap">
        <el-icon class="helpIcon" style="font-size: 20px">
          <component :is="tableOrMapIcon[tableOrMap]" />
        </el-icon>
      </el-button>
    </div>
  </div>
  <el-table :data="data.tableData" size="large" @row-click="handleRowClick">
    <el-table-column prop="deviceId" label="资产编码" min-width="150" />
    <el-table-column label="开门时间" min-width="170">
      <template #default="scope">
        {{ getTime(scope.row.openTime) }}
      </template>
    </el-table-column>
    <el-table-column label="关门时间" min-width="170">
      <template #default="scope">
        {{ getTime(scope.row.closeTime) }}
      </template>
    </el-table-column>
    <el-table-column label="购物编码" width="200" />
    <el-table-column prop="productName" label="商品信息" min-width="170" />
    <template v-for="item in itemStore.items" :key="item.label">
      <el-table-column v-show="item.checked" :label="item.label">
        <template v-if="item.label === '购物图片'" #default="scope">
          <el-button :disabled="!scope.row.purchaseImage" @click="getPurchaseImage(scope.row.purchaseImage)">查看</el-button>
        </template>
        <template v-else-if="item.label === '陈列图片'" #default="scope">
          <el-button :disabled="!scope.row.displayImage" @click="getDisplayImage(scope.row.displayImage)">查看</el-button>
        </template>
      </el-table-column>
    </template>
    <el-table-column width="120">
      <template #header>
        <span>状态</span>
        <el-tooltip content="自定义">
          <el-button text :icon="Operation" style="font-size: 20px" @click="itemStore.drawer = true" />
        </el-tooltip>
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
  <el-image-viewer v-if="data.image" :url-list="[data.imageUrl]" hide-on-click-modal="true" @close="closeImage()" />
  <Drawer />
</template>

<script setup lang="ts">
import { useFreezerStore, useItemStore } from '@/store/store'
import { getCommodityByIndex, getComplexlyPage, getDeviceInfo } from '@/utils/commonRequset'
import { markRaw, reactive, ref } from 'vue'
import { List, Operation, MapLocation } from '@element-plus/icons-vue'
import Drawer from './Drawer.vue'

const FreezerStore = useFreezerStore()
const input = reactive({
  name: '',
  number: '',
  time: ['', ''],
})
const data = reactive({
  tableData: [] as complexly[],
  currentPage: 1,
  pageSize: 5,
  total: 0,
  image: false,
  imageUrl: '',
})
const itemStore = useItemStore()
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    },
  },
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]
const tableOrMap = ref(0)
const tableOrMapIcon = [markRaw(List), markRaw(MapLocation)]

const tableInit = () => {
  getComplexlyPage(data).then(async (res) => {
    if (!res) {
      return
    }
    for (const item of res.data) {
      const deviceName = (await getDeviceName(item.deviceId)) || ''
      const productName = (await getProductName(item.sale)) || ''
      item.deviceId = deviceName
      item.productName = productName
    }
    data.tableData = res.data
    data.total = res.totalElements
  })
}
tableInit()

const getDeviceName = async (deviceId: string) => {
  if (!deviceId) {
    return
  }
  const res = await getDeviceInfo(deviceId)
  if (!res) {
    return
  }
  return res.name
}

const getProductName = async (sale: { [key: string]: string }) => {
  const key = Object.keys(sale)[0]
  const item = itemStore.id2Item.find((item) => Object.keys(item)[0] === key)
  if (item) {
    return Object.values(item)[0] + ':' + sale[Object.keys(sale)[0]]
  }
  const res = await getCommodityByIndex(key)
  if (!res) {
    return
  }
  const id2Item = { [key]: res.name }
  Array.isArray(itemStore.id2Item) ? itemStore.id2Item.push(id2Item) : (itemStore.id2Item = [id2Item])
  return res.name + ':' + sale[Object.keys(sale)[0]]
}

const getTime = (time: number) => {
  var date = new Date(time)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' '
  const h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':'
  const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':'
  const s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  return Y + M + D + h + m + s
}

const getPurchaseImage = async (purchaseImage: { [key: string]: string } | null) => {
  if (!purchaseImage) {
    return
  }
  data.imageUrl = purchaseImage['1']
  data.image = true
}

const getDisplayImage = async (displayImage: { [key: string]: string } | null) => {
  if (!displayImage) {
    return
  }
  data.imageUrl = displayImage['1']
  data.image = true
}

const closeImage = () => {
  data.image = false
}

const handleRowClick = (row: deviceInfo) => {
  FreezerStore.chooseRow = row
}

const search = () => {
  // getComplexlyPage(data, input).then(res => {
  // })
}

const reset = () => {
  input.name = ''
  input.number = ''
  input.time = ['', '']
  tableInit()
}

const switchTableMap = () => {
  if (tableOrMap.value === 0) {
    tableOrMap.value = 1
  } else {
    tableOrMap.value = 0
  }
}
</script>

<style scoped>
.tableHead {
  display: flex;
  background-color: #f9faff;
  width: 100%;
  padding: 10px;
  justify-content: space-between;
}
.headLine {
  display: flex;
}
.input {
  width: 15%;
}
.picker {
  width: 400px;
}
</style>
