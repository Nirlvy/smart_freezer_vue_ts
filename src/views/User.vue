<template>
  <div style="padding: 10px 0">
    <el-input
      v-model="input.id"
      class="ml-10"
      style="width: 220px"
      placeholder="ID"
      clearable
      :prefix-icon="InfoFilled"
      @clear="load()"
    /><el-input
      v-model="input.userName"
      class="ml-10"
      style="width: 220px"
      placeholder="用户名"
      clearable
      :prefix-icon="User"
      @clear="load()"
    />
    <el-date-picker
      v-model="input.date"
      class="ml-10"
      type="date"
      placeholder="日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @clear="load()"
    />
    <el-input
      v-model="input.shelves"
      class="ml-10"
      style="width: 220px"
      placeholder="数量前后100的上架"
      clearable
      :prefix-icon="ShoppingCartFull"
      @clear="load()"
    />
    <el-input
      v-model="input.sold"
      class="ml-10"
      style="width: 220px"
      placeholder="数量前后100的售出"
      clearable
      :prefix-icon="ShoppingCart"
      @clear="load()"
    />
    <el-button class="ml-10" :icon="Search" @click="clear()"> 清除 </el-button>
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
      cancel-button-text="我再想想"
      @confirm="batchDelete"
    >
      <template #reference>
        <el-button type="danger" :icon="DocumentDelete">批量删除</el-button>
      </template>
    </el-popconfirm>
    <el-upload
      v-model:action="server_url"
      class="ml-10"
      :on-success="handleUpSuccess"
      :on-error="handleUpError"
      :limit="1"
      :on-exceed="handleExceed"
      accept=".xlsx"
      :show-file-list="false"
      style="display: inline-flex; top: 3px"
    >
      <el-button type="primary" :icon="FolderAdd">导入</el-button>
    </el-upload>
    <el-button type="primary" class="ml-10" :icon="DocumentCopy" @click="exp()"
      >导出</el-button
    >
  </div>

  <el-dialog v-model="new_dialog" title="新增用户">
    <el-form
      ref="ruleFormRef"
      :model="register_form"
      :rules="register_rules"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="用户名" :label-width="70" prop="userName">
        <el-input
          v-model="register_form.userName"
          :prefix-icon="UserFilled"
          placeholder="请输入1-20个字符作为你的用户名"
          clearable
          minlength="1"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="密码" :label-width="70" prop="password">
        <el-input
          v-model="register_form.password"
          :prefix-icon="Lock"
          placeholder="请输入6-30个字符作为你的密码"
          clearable
          show-password
          minlength="6"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="确认密码" :label-width="70" prop="confirmPassword">
        <el-input
          v-model="register_form.confirmPassword"
          :prefix-icon="Lock"
          placeholder="请重复输入一次你的密码"
          clearable
          show-password
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

  <el-table :data="tableData" @selection-change="selection">
    <el-table-column type="selection" width="30" />
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="userName" label="用户名" />
    <el-table-column prop="role" label="身份" />
    <el-table-column prop="createTime" label="注册时间" />
    <el-table-column prop="shelves" label="上架总数" />
    <el-table-column prop="sold" label="销售总数" />
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          :icon="Edit"
          @click="handleEdit(scope.row)"
          >编辑</el-button
        >
        <el-popconfirm
          title="确定删除?"
          width="200"
          cancel-button-text="我再想想"
          @confirm="handleDelete(scope.row)"
        >
          <template #reference>
            <el-button size="small" type="danger" :icon="DocumentDelete"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="edit_dialog" title="用户信息修改" width="25%">
    <el-form
      ref="ruleFormRef"
      :model="edit_form"
      label-width="80"
      :rules="edit_rules"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="edit_form.userName"
          :prefix-icon="UserFilled"
          placeholder="请输入1-20个字符作为你的新用户名"
          clearable
          minlength="1"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="身份" prop="role">
        <el-radio-group v-model="edit_form.role">
          <el-radio label="admin">管理员</el-radio>
          <el-radio label="user">用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="注册时间" prop="createTime">
        <el-date-picker
          v-model="edit_form.createTime"
          type="datetime"
          placeholder="请选择新的时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="上架数" prop="shelves">
        <el-input
          v-model="edit_form.shelves"
          placeholder="请输入你的新上架数"
          clearable
        />
      </el-form-item>
      <el-form-item label="售出数" prop="sold">
        <el-input
          v-model="edit_form.sold"
          placeholder="请输入你的新售出数"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="edit_dialog = false">取消</el-button>
        <el-button type="primary" @click="edit_corfirm(ruleFormRef)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <div class="ml-10" style="padding: 10px 0">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="load"
      @current-change="load"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  Search,
  Edit,
  DocumentDelete,
  Plus,
  DocumentCopy,
  FolderAdd,
  User,
  InfoFilled,
  ShoppingCartFull,
  ShoppingCart,
  UserFilled,
  Lock,
} from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import request from '../utils/request'
import { useStore } from '../store/store'

interface Userinfor {
  id: number
  userName: string
  createTime: string
  shelves: number
  sold: number
}
interface ServerData {
  records: string
  total: number
}

const store = useStore()
const tableData = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const new_dialog = ref(false)
const edit_dialog = ref(false)
const multipleSelection = ref<Userinfor[]>([])
const upload = ref<UploadInstance>()
const server = store.ServerIp
const server_url = ref(server + '/user/import')
const input = reactive({
  id: '',
  userName: '',
  date: [],
  shelves: '',
  sold: '',
})
const register_form = reactive({
  userName: '',
  password: '',
  confirmPassword: '',
})
const edit_form = reactive({
  id: '',
  userName: '',
  role: 'user',
  createTime: '',
  shelves: '',
  sold: '',
})
const ruleFormRef = ref<FormInstance>()
const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    if (register_form.confirmPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== register_form.password) {
    callback(new Error('两次输入不一致！'))
  } else {
    callback()
  }
}

const register_rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应该为1到20位', trigger: 'blur' },
  ],
  password: [
    { min: 6, max: 30, message: '长度应该为6到30位', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  confirmPassword: [
    { min: 6, max: 30, message: '长度应该为6到30位', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
})

const edit_rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应该为1到20位', trigger: 'blur' },
  ],
  role: [{ required: true }],
  createTime: [{ required: true, message: '请输入注册时间', trigger: 'blur' }],
  shelves: [
    { required: true, message: '请输入上架数量', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  sold: [
    { required: true, message: '请输入售出数量', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
})

const clear = () => {
  Object.assign(register_form, {
    userName: '',
    password: '',
    confirmPassword: '',
  })

  Object.assign(edit_form, {
    id: '',
    userName: '',
    createTime: '',
    shelves: '',
    sold: '',
  })
  Object.assign(input, {
    id: '',
    userName: '',
    date: [],
    shelves: '',
    sold: '',
  })
  load()
}

const load = () => {
  request
    .get<{ data: ServerData }, ServerData>(
      '/user/page?pageNum=' +
        currentPage.value +
        '&pageSize=' +
        pageSize.value +
        '&id=' +
        input.id +
        '&userName=' +
        input.userName +
        '&createTime=' +
        input.date +
        '&shelves=' +
        input.shelves +
        '&sold=' +
        input.sold
    )
    .then((res) => {
      tableData.value = res.records
      total.value = res.total
    })
}
load()
const new_crofirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      request
        .post<{ data: RServerData }, RServerData>(
          '/user/register',
          register_form
        )
        .then((res) => {
          if (res.code === '200') {
            ElMessage.success('注册成功')
            new_dialog.value = false
            currentPage.value = Math.ceil((total.value + 1) / pageSize.value)
            clear()
          } else {
            ElMessage.error(res.msg)
          }
        })
    }
  })
}
const handleEdit = (row: string) => {
  Object.assign(edit_form, row)
  edit_dialog.value = true
}
const edit_corfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      {
        request.post('/user?userName=', edit_form).then((res) => {
          if (res) {
            {
              ElMessage.success('修改成功！')
              edit_dialog.value = false
              input.id = edit_form.id
              clear()
            }
          }
        })
      }
    } else {
      ElMessage.error('输入不符合要求，请检查！')
    }
  })
}
const handleDelete = (row: string) => {
  Object.assign(edit_form, row)
  request.delete('/user/' + edit_form.id).then((res) => {
    if (res) {
      ElMessage.success('删除成功！')
      load()
    }
  })
}
const selection = (val: Userinfor[]) => {
  multipleSelection.value = val
}
const batchDelete = () => {
  let ids = multipleSelection.value.map((v) => v.id)
  request.delete('/user/del/batch', { data: ids }).then((res) => {
    if (res) {
      ElMessage.success('删除成功！')
      load()
    }
  })
}
const exp = async () => {
  try {
    const res = await request.get(server + '/user/export', {
      responseType: 'blob',
    })
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const fileName = '用户信息.xlsx'
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
  } catch (err) {
    console.error(err)
  }
}
const handleUpSuccess = () => {
  ElMessage.success('上传成功')
  load()
}
const handleUpError = () => {
  ElMessage.error('上传失败，请稍后再试')
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value?.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value?.handleStart(file)
}
</script>

<style scoped></style>
