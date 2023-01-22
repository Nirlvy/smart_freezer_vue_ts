<template>
  <el-table :data="tableData" @selection-change="selection">
    <el-table-column type="selection" width="30" />
    <el-table-column prop="freezerId" label="冰柜ID" width="60" />
    <el-table-column prop="name" label="商品名" />
    <el-table-column prop="state" label="状态" />
    <el-table-column prop="upTime" label="上架时间" />
    <el-table-column prop="downTime" label="下架时间" />
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          :icon="Edit"
          @click="handleEdit(scope.row)"
          >编辑
        </el-button>
        <el-popconfirm
          title="确定删除?"
          width="200"
          @confirm="handleDelete(scope.row)"
          cancel-button-text="我再想想"
        >
          <template #reference>
            <el-button size="small" type="danger" :icon="DocumentDelete">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { Edit, DocumentDelete } from "@element-plus/icons-vue"
import { reactive, ref } from "vue"

interface goodsinfo {
  selection: number[]
  freezerid: number
  name: string
  state: string
  upTime: string
  downTime: string
}

const tableData = reactive({
  selection: [],
  freezerid: 0,
  name: "",
  state: "",
  upTime: "",
  downTime: "",
})
const multipleSelection = ref<goodsinfo[]>([])

const selection = (val: goodsinfo[]) => {
  multipleSelection.value = val
}
</script>

<style scoped></style>
