<template>
  <div style="padding: 10px 0">
    <el-select
      class="ml-10"
      v-model="input.id"
      placeholder="冰柜ID"
      style="width: 220px"
      clearable
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      class="ml-10"
      style="width: 220px"
      placeholder="商品名"
      clearable
      @clear="load()"
      v-model="input.name"
      :prefix-icon="User"
    />
    <el-select
      class="ml-10"
      v-model="input.state"
      placeholder="状态"
      style="width: 220px"
      clearable
    >
      <el-option
        v-for="item in states"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-date-picker
      class="ml-10"
      v-model="input.upDate"
      type="date"
      placeholder="上架日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @clear="load()"
    />
    <el-date-picker
      class="ml-10"
      v-model="input.downDate"
      type="date"
      placeholder="下架日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @clear="load()"
    />
    <el-button type="primary" class="ml-10" :icon="Search" @click="load()">
      搜索
    </el-button>
  </div>

  <div style="padding: 10px 10px">
    <el-button type="primary" :icon="Plus" @click="new_dialog = true"
      >新增</el-button
    >
    <el-popconfirm
      title="确定批量删除?"
      width="200"
      @confirm="batchDelete"
      cancel-button-text="我再想想"
    >
      <template #reference>
        <el-button type="danger" :icon="DocumentDelete">批量删除</el-button>
      </template>
    </el-popconfirm>
    <el-button type="primary" class="ml-10" :icon="DocumentCopy" @click="exp()"
      >导出
    </el-button>
  </div>

  <el-dialog v-model="new_dialog" title="新上架">
    <el-form
      :model="up_form"
      :rules="up_rules"
      ref="ruleFormRef"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="商品名" :label-width="70" prop="name">
        <el-input
          v-model="up_form.name"
          :prefix-icon="UserFilled"
          placeholder="请输入1-10个字符"
          clearable
          minlength="1"
          maxlength="10"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="数量" :label-width="70" prop="num">
        <el-input
          v-model="up_form."
          :prefix-icon="Lock"
          placeholder="请输入6-30个字符作为你的密码"
          clearable
          minlength="6"
          maxlength="30"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="new_dialog = false">取消</el-button>
        <el-button type="primary" @click="new_crofirm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-table
    :data="tableData"
    :row-class-name="tableRowClassName"
    @selection-change="selection"
  >
    <el-table-column type="selection" width="30" />
    <el-table-column prop="id" label="ID" width="40" />
    <el-table-column prop="freezerId" label="冰柜ID" width="80" />
    <el-table-column prop="name" label="商品名" />
    <el-table-column prop="state" label="状态" />
    <el-table-column prop="upTime" label="上架时间" />
    <el-table-column prop="downTime" label="下架时间" />
    <el-table-column label="操作" width="100">
      <template #default="scope">
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
  <div class="ml-10" style="padding: 10px 0">
    <el-pagination
      v-model:current-page="data.currentPage"
      :page-sizes="[5, 10, 15]"
      v-model:page-size="data.pageSize"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
      @size-change="load"
      @current-change="load"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  DocumentDelete,
  User,
  Search,
  DocumentCopy,
  Plus,
} from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { reactive, ref } from "vue"
import request from "../utils/request"

interface goodsinfo {
  id: number
  freezerid: number
  name: string
  state: boolean | string
  upTime: string
  downTime: string | null
}
type records = Array<{
  id: number
  freezerId: number
  name: string
  state: boolean | string
  upTime: string
  downTime: string | null
}>
interface ServerData {
  records: records
  total: number
}

const tableData = ref()
const new_dialog = ref(false)
const data = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  freezerId: [] as number[],
})
const input = reactive({
  id: [] as number[],
  name: "",
  state: "",
  upDate: "",
  downDate: "",
})
const edit_form = reactive({
  id: 0,
  freezerId: 0,
  name: "",
  state: "",
  upTime: "",
  downTime: "",
})
const multipleSelection = ref<goodsinfo[]>([])
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}
const options = ref()
const states = ref([
  {
    value: "true",
    label: "未售出",
  },
  {
    value: "false",
    label: "已售出",
  },
])
const tableRowClassName = ({ row }: { row: goodsinfo }) => {
  if (row.state == "已售出") {
    return "success-row"
  }
  return ""
}

const load = () => {
  request
    .post<{ data: ServerData }, ServerData>(
      "/shelvesLog/page?pageNum=" +
        data.currentPage +
        "&pageSize=" +
        data.pageSize +
        "&id=" +
        user.id +
        "&name=" +
        input.name +
        "&state=" +
        input.state +
        "&upTime=" +
        input.upDate +
        "&downTime=" +
        input.downDate,
      Array.from(input.id)
    )
    .then((res) => {
      let tabledata = res.records.map((item) => {
        item.state = item.state ? "未售出" : "已售出"
        return item
      })
      tableData.value = tabledata
      data.total = res.total
      data.freezerId = [
        ...new Set(res.records.map((record) => record.freezerId)),
      ]
      options.value = Array.from(data.freezerId).map((item) => ({
        value: item,
        label: item,
      }))
    })
}
load()
const selection = (val: goodsinfo[]) => {
  multipleSelection.value = val
}
const handleDelete = (row: string) => {
  Object.assign(edit_form, row)
  request.delete("/shelvesLog/" + edit_form.id).then((res) => {
    if (res) {
      ElMessage.success("删除成功！")
      load()
    }
  })
}
const batchDelete = () => {
  let ids = multipleSelection.value.map((v) => v.id)
  request.delete("/shelvesLog/del/batch", { data: ids }).then((res) => {
    if (res) {
      ElMessage.success("删除成功！")
      load()
    }
  })
}
</script>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
