<template>
  <div style="padding: 10px 0">
    <el-select
      class="ml-10"
      v-model="input.id"
      placeholder="冰柜ID"
      style="width: 220px"
      multiple
      collapse-tags
      collapse-tags-tooltip
      clearable
      @clear="load()"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      class="ml-10"
      v-model="input.name"
      placeholder="商品名"
      multiple
      collapse-tags
      collapse-tags-tooltip
      clearable
      @clear="load()"
    >
      <el-option
        v-for="item in goods"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
    <el-button type="primary" :icon="Plus" @click="up_dialog = true">
      新增
    </el-button>
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
    <el-button type="primary" class="ml-10" :icon="DocumentCopy" @click="exp()">
      导出
    </el-button>
  </div>

  <el-dialog v-model="up_dialog" title="新上架" width="400px">
    <el-form :model="up_form" :rules="up_rules" ref="ruleFormRef" status-icon>
      <el-form-item label="冰柜" :label-width="70" prop="id">
        <el-select v-model="up_form.id" placeholder="冰柜ID" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名" :label-width="70" prop="name">
        <el-select v-model="up_form.name" placeholder="商品名" clearable>
          <el-option
            v-for="item in goods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" :label-width="70" prop="num">
        <el-input
          v-model="up_form.num"
          :prefix-icon="Star"
          placeholder="请输入上架数量"
          clearable
          minlength="1"
          maxlength="3"
          show-word-limit
          style="width: 225px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="up_dialog = false">取消</el-button>
        <el-button type="primary" @click="up_crofirm(ruleFormRef)">
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
    <el-table-column prop="id" label="ID" width="50" />
    <el-table-column prop="freezerId" label="冰柜ID" width="80" />
    <el-table-column prop="name" label="商品名" />
    <el-table-column label="状态">
      <template #default="scope">
        <el-switch
          v-model="scope.row.state"
          :disabled="!scope.row.state"
          inline-prompt
          active-text="未售出"
          inactive-text="已售出"
          @change="Change(scope.row)"
        />
      </template>
    </el-table-column>
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
  Search,
  DocumentCopy,
  Plus,
  Star,
} from "@element-plus/icons-vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { inject, reactive, ref } from "vue"
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
interface GServerData {
  id: number
  name: string
  disable: boolean
}
interface RServerData {
  code: string
  msg: string
  data: object
}

const ruleFormRef = ref<FormInstance>()
const tableData = ref()
const up_dialog = ref(false)
const data = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  freezerId: [] as number[],
})
const input = reactive({
  id: [] as number[],
  name: [] as string[],
  state: "",
  upDate: "",
  downDate: "",
})
const edit_form = reactive({
  id: "",
  freezerId: "",
  name: "",
  state: "",
  upTime: "",
  downTime: "",
})
const up_form = reactive({
  id: "",
  name: "",
  num: "",
})
const multipleSelection = ref<goodsinfo[]>([])
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}
const server = inject("ServerIp")
const options = ref()
const goods = ref()
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
  if (row.state == false) {
    return "success-row"
  }
  return ""
}
const up_rules = reactive<FormRules>({
  id: [{ required: true, message: "请选择冰柜", trigger: "blur" }],
  name: [{ required: true, message: "请选择商品名", trigger: "blur" }],
  num: [
    { required: true, message: "请输入上架数量", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
})
const load = () => {
  request
    .post<{ data: ServerData }, ServerData>(
      "/shelvesLog/page?pageNum=" +
        data.currentPage +
        "&pageSize=" +
        data.pageSize +
        "&id=" +
        user.id +
        "&state=" +
        input.state +
        "&upTime=" +
        input.upDate +
        "&downTime=" +
        input.downDate,
      {
        freezerId: Array.from(input.id),
        name: Array.from(input.name),
      }
    )
    .then((res) => {
      tableData.value = res.records
      data.total = res.total
      data.freezerId = [
        ...new Set(res.records.map((record) => record.freezerId)),
      ]
      options.value = Array.from(data.freezerId).map((item) => ({
        value: item,
        label: item,
      }))
    })
  if (!goods.value)
    request
      .get<{ data: GServerData[] }, GServerData[]>("/goods")
      .then((res) => {
        goods.value = Array.from(res).map((item) => ({
          value: item.name,
          label: item.name,
          disabled: item.disable,
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
const Change = (row: { state: boolean }) => {
  if (!row.state) {
    Object.assign(edit_form, row)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const day = currentDate.getDate().toString().padStart(2, "0")
    const hours = currentDate.getHours().toString().padStart(2, "0")
    const minutes = currentDate.getMinutes().toString().padStart(2, "0")
    const seconds = currentDate.getSeconds().toString().padStart(2, "0")
    const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    edit_form.downTime = time
    request.post("/shelvesLog/sold", edit_form).then((res) => {
      if (res) {
        ElMessage.success("已设置为售出")
        load()
      }
    })
  }
}
const up_crofirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      request
        .post<{ data: RServerData }, RServerData>(
          "/shelvesLog/up?id=" +
            up_form.id +
            "&name=" +
            up_form.name +
            "&num=" +
            up_form.num
        )
        .then((res) => {
          if (res.code === "200") {
            ElMessage.success("上架成功")
            up_dialog.value = false
            load()
          } else {
            ElMessage.error(res.msg)
          }
        })
    }
  })
}
const exp = async () => {
  request
    .get(server + "/shelvesLog/export?id=" + user.id, {
      responseType: "blob",
    })
    .then((response) => {
      if (response) {
        const blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        })
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = "data.xlsx"
        link.click()
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      } else {
        alert("请求失败,请稍后再试")
      }
    })
    .catch((error) => {
      console.log(error)
      alert("请求失败,请稍后再试")
    })
}
</script>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
