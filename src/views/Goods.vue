<template>
  <div style="padding: 10px 0">
    <el-select
      v-model="input.id"
      class="ml-10 input"
      placeholder="冰柜ID"
      multiple
      collapse-tags
      collapse-tags-tooltip
      clearable
      @clear="load"
      @change="load"
    >
      <el-option
        v-for="item in freezer"
        :key="item.freezerId"
        :label="item.freezerId"
        :value="item.freezerId"
      />
    </el-select>
    <el-select
      v-model="input.name"
      class="ml-10 input"
      placeholder="商品名"
      multiple
      collapse-tags
      collapse-tags-tooltip
      clearable
      @clear="load"
      @change="load"
    >
      <el-option
        v-for="item in user.goods"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-select
      v-model="input.state"
      class="ml-10 input"
      placeholder="状态"
      clearable
      @clear="load"
      @change="load"
    >
      <el-option
        v-for="item in states"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-date-picker
      v-model="input.upDate"
      class="ml-10"
      type="date"
      placeholder="上架日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @clear="load"
      @change="load"
    />
    <el-date-picker
      v-model="input.downDate"
      class="ml-10"
      type="date"
      placeholder="下架日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @clear="load"
      @change="load"
    />
    <el-button class="ml-10" :icon="Search" @click="clear()">清除</el-button>
  </div>
  <div style="padding: 10px 10px">
    <el-button
      v-if="freezer.length != 0"
      type="primary"
      :icon="Plus"
      @click="upButtonClick"
    >
      新增
    </el-button>
    <el-popconfirm
      title="确定批量删除?"
      width="200"
      cancel-button-text="我再想想"
      @confirm="batchDelete"
    >
      <template #reference>
        <el-button type="danger" :icon="DocumentDelete">批量删除</el-button>
      </template>
    </el-popconfirm>
    <el-button type="primary" class="ml-10" :icon="DocumentCopy" @click="exp()">
      导出
    </el-button>
  </div>
  <el-dialog v-model="upDialog" title="新上架" width="400px">
    <el-form ref="ruleFormRef" :model="upForm" :rules="upRules" status-icon>
      <el-form-item label="冰柜" :label-width="70" prop="id">
        <el-select
          v-model="upForm.id"
          placeholder="冰柜ID"
          clearable
          @change="inputIdChange"
        >
          <el-option
            v-for="item in freezer"
            :key="item.freezerId"
            :label="item.freezerId"
            :value="item.freezerId"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名" :label-width="70" prop="name">
        <el-select v-model="upForm.name" placeholder="商品名" clearable>
          <el-option
            v-for="item in upGoods"
            :key="item.label"
            :label="item.label"
            :value="item.label"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" :label-width="70" prop="num">
        <el-input-number v-model="upForm.num" :min="1" :max="inputMax" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="upDialog = false">取消</el-button>
        <el-button type="primary" @click="upCrofirm(ruleFormRef)">
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
    <el-table-column prop="id" label="ID" min-width="30" />
    <el-table-column prop="freezerId" label="冰柜ID" min-width="50" />
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
    <el-table-column prop="upTime" label="上架时间" min-width="135" />
    <el-table-column prop="downTime" label="下架时间" min-width="135" />
    <el-table-column label="操作" min-width="70">
      <template #default="scope">
        <el-popconfirm
          title="确定删除?"
          width="200"
          cancel-button-text="我再想想"
          @confirm="handleDelete(scope.row)"
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
      v-model:current-page="pageData.currentPage"
      v-model:page-size="pageData.pageSize"
      :page-sizes="[5, 8, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total"
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
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElMessage,
  ElOption,
  ElPagination,
  ElPopconfirm,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  FormInstance,
  FormRules,
} from 'element-plus'
import { reactive, ref } from 'vue'
import { useStore } from '../store/store'
import request from '../utils/request'

interface goodsinfo {
  id: number
  freezerId: number
  name: string
  state: boolean | string
  upTime: string
  downTime: string | null
}
interface GServerData {
  id: number
  name: string
  disable: boolean
}
interface Goods {
  label: string
  disabled: boolean
}

const store = useStore()
const user = store.user
const freezer = store.freezer
const ruleFormRef = ref<FormInstance>()
const tableData = ref()
const upDialog = ref(false)
const inputMax = ref(1)
const pageData = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
const upGoods = ref<Goods[]>([])
const input = reactive({
  id: [] as number[],
  name: [] as string[],
  state: '',
  upDate: '',
  downDate: '',
})
// TODO:类型问题
const editForm = reactive({
  id: '',
  freezerId: '',
  name: '',
  state: '',
  upTime: '',
  downTime: '',
})
const upForm = reactive({
  id: freezer.length != 0 ? freezer[0].freezerId : 0,
  name: '',
  num: 0,
})
const multipleSelection = ref<goodsinfo[]>([])
const states = ref([
  {
    value: 'true',
    label: '未售出',
  },
  {
    value: 'false',
    label: '已售出',
  },
])
const tableRowClassName = ({ row }: { row: goodsinfo }) => {
  if (row.state == false) {
    return 'success-row'
  }
  return ''
}
const upRules = reactive<FormRules>({
  id: [{ required: true, message: '请选择冰柜', trigger: 'blur' }],
  name: [{ required: true, message: '请选择商品名', trigger: 'blur' }],
  num: [
    { required: true, message: '请输入上架数量', trigger: 'blur' },
    {
      type: 'number',
      message: '请输入数字',
      trigger: 'blur',
      transform: (value) => Number(value),
    },
  ],
})

const load = () => {
  request
    .post(
      '/shelvesLog/page?pageNum=' +
        pageData.currentPage +
        '&pageSize=' +
        pageData.pageSize +
        '&state=' +
        input.state +
        '&upTime=' +
        input.upDate +
        '&downTime=' +
        input.downDate,
      {
        freezerId:
          Array.from(input.id) === null || Array.from(input.id).length === 0
            ? store.getValue('freezerId')
            : Array.from(input.id),
        name: Array.from(input.name),
      }
    )
    .then((res) => {
      tableData.value = res.records
      pageData.total = res.total
    })
  request
    .post('/shelvesLog/homeinfo', store.getValue('freezerId'))
    .then((res) => {
      if (res.code === 200) {
        user.goods = res.data.soldCharts[0]
      }
    })
  request.get<{ data: GServerData[] }, GServerData[]>('/goods').then((res) => {
    upGoods.value = Array.from(res).map((item) => ({
      label: item.name,
      disabled: item.disable,
    }))
  })
}

load()

const clear = () => {
  Object.assign(input, {
    id: [] as number[],
    name: [] as string[],
    state: '',
    upDate: '',
    downDate: '',
  })
}

const selection = (val: goodsinfo[]) => {
  multipleSelection.value = val
}

const inputIdChange = () => {
  // TODO:可能简化
  if (!freezer[0].capacity) {
    request.get('/freezer/list?id=' + user.id).then((res) => {
      ;(res as any).forEach((item: { capacity: number }, index: number) => {
        freezer[index].capacity = item.capacity
      })
    })
  }
  let index = store.getIndex('freezerId', upForm.id)
  inputMax.value = freezer[index].capacity - freezer[index].shelves
}

const handleDelete = (row: string) => {
  Object.assign(editForm, row)
  request.delete('/shelvesLog/' + editForm.id).then((res) => {
    if (res) {
      ElMessage.success('删除成功！')
      if (editForm.state === 'true') {
        freezer[store.getIndex('capacity', upForm.id)].shelves -= 1
      }
      load()
    }
  })
}

const batchDelete = () => {
  let ids = multipleSelection.value.map((v) => v.id)
  let states = multipleSelection.value.map((v) => [v.freezerId, v.state])
  request.delete('/shelvesLog/del/batch', { data: ids }).then((res) => {
    if (res) {
      ElMessage.success('删除成功！')
      let result = states.reduce((acc, cur) => {
        if (cur[1]) {
          acc[cur[0].toString()] = (acc[cur[0].toString()] || 0) + 1
        }
        return acc
      }, {})
      for (let key in result) {
        let freezerId = parseInt(key)
        let count = result[key]
        let index = store.getIndex('freezerId', freezerId)
        if (index !== -1) {
          freezer[index].shelves -= count
        }
      }
      load()
    }
  })
}

const Change = (row: { state: boolean }) => {
  if (!row.state) {
    Object.assign(editForm, row)
    editForm.downTime = store.getTime()
    request.post('/shelvesLog/update', editForm).then((res) => {
      if (res) {
        ElMessage.success('已设置为售出')
        freezer[store.getIndex('freezerId', upForm.id)].shelves -= 1
        load()
      }
    })
  }
}

const upCrofirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      request
        .post(
          '/shelvesLog/up?id=' +
            upForm.id +
            '&name=' +
            upForm.name +
            '&num=' +
            upForm.num
        )
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('上架成功')
            upDialog.value = false
            freezer[store.getIndex('freezerId', upForm.id)].shelves += Number(
              upForm.num
            )
            load()
          }
        })
      let time = store.getTime()
      request.post<{ data: RServerData }, RServerData>('/freezer/update', {
        id: upForm.id,
        lastSupply: time,
      })
    }
  })
}

const upButtonClick = () => {
  upDialog.value = true
  inputIdChange()
}

const exp = async () => {
  request
    .get('/shelvesLog/export?id=' + user.id, { responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res] as any)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '商品信息.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
}
</script>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.input {
  width: 10%;
}
</style>
