<template>
  <div
    class="windows"
    :class="{ focus: store.blur }"
    @mouseenter="store.blur = true"
    @mouseleave="store.blur = false"
  >
    <div style="margin: 20px 0; text-align: center; font-size: 24px">
      <b>智能冰柜管理系统</b>
    </div>
    <el-form ref="ruleFormRef" :model="user" :rules="rules">
      <el-form-item prop="userName">
        <el-input
          v-model="user.userName"
          size="large"
          style="margin: 10px 0"
          :prefix-icon="UserFilled"
          placeholder="用户名"
          autocomplete
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="user.password"
          size="large"
          style="margin: 10px 0"
          :prefix-icon="Lock"
          show-password
          placeholder="密码"
          autocomplete
          clearable
        />
      </el-form-item>
      <el-form-item class="el-form-button">
        <el-button
          type="primary"
          size="large"
          round
          @click="login(ruleFormRef)"
        >
          登录
        </el-button>
        <el-button
          type="success"
          size="large"
          round
          @click="router.push('/register')"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Lock, UserFilled } from '@element-plus/icons-vue'
import request from '../utils/request'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { setRotes } from '../router'
import { useStore } from '../store/store'

interface objectdata {
  id: number
  userName: string
  password?: string
  token: string
  img: string
  menus: [number]
  role: string
}

interface ServerData {
  code: string
  data: objectdata
  msg: string
}

const user = reactive({
  userName: '',
  password: '',
})
const store = useStore()
const router = useRouter()
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应该为1到20位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '长度应该为6到30位', trigger: 'blur' },
  ],
})
const ruleFormRef = ref<FormInstance>()

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      request
        .post<{ data: ServerData }, ServerData>('/user/login', user)
        .then((res) => {
          if (res.code === '200') {
            const userinfo = { ...res.data }
            delete userinfo.password
            store.user = userinfo
            setRotes()
            router.push('/manage/home')
            ElMessage.success('登录成功')
          } else {
            ElMessage.error(res.msg)
          }
        })
    }
  })
}
</script>

<style scoped>
.windows {
  position: relative;
  z-index: 1;
  margin: 200px auto;
  background-color: #fff;
  width: 350px;
  height: 310px;
  padding: 20px;
  border-radius: 10px;
  will-change: scale, opacity;
  scale: (1);
  opacity: 0.2;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.windows.focus {
  transform: scale(1.2);
  opacity: 0.8;
}

.el-form-button :deep() .el-form-item__content {
  text-align: right;
  display: block;
}
</style>
