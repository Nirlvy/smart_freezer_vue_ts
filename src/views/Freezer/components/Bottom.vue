<template>
  <el-table :data="tableData">
    <el-table-column fixed type="selection" label="客户地址" />
    <el-table-column prop="name" label="资产编码" width="130px" />
    <el-table-column prop="deviceName" label="设备名称" />
    <el-table-column prop="capacity" label="IMEI" />
    <el-table-column prop="shelves" label="设备地址" />
    <el-table-column prop="shelves" label="设备厂商" />
    <el-table-column prop="shelves" label="瓶装厂" />
    <el-table-column prop="shelves" label="省" />
    <el-table-column prop="shelves" label="市" />
    <el-table-column prop="shelves" label="业代" />
    <el-table-column prop="shelves" label="业务所" />
    <el-table-column prop="shelves" label="代理电话" />
    <el-table-column prop="shelves" label="仓库" />
    <el-table-column prop="shelves" label="仓库地址" />
    <el-table-column prop="shelves" label="客户形态" />
    <el-table-column prop="shelves" label="客户地址" />
    <el-table-column prop="shelves" label="购入日期" />
    <el-table-column prop="shelves" label="陈列" />
    <el-table-column fixed="right" prop="shelves" label="状态" />
    <el-table-column fixed="right" prop="shelves" label="操作" />
  </el-table>
  <div class="ml-10" style="padding: 10px 0">
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="requestPage"
      @current-change="requestPage"
    />
  </div>
</template>

<script setup lang="ts">
import { requestPage } from '@/utils/commonRequset'
import { reactive, ref } from 'vue'

const tableData = ref()
const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0,
})

requestPage(pagination.pageSize, pagination.currentPage).then((res) => {
  if (!res) {
    return
  }
  tableData.value = res.data
  pagination.total = res.totalElements
})
</script>

<style scoped></style>
