<template>
  <div
    class="windows"
    :class="{ focus: blur }"
    @mouseenter="blur = true"
    @mouseleave="blur = false"
  >
    <div style="margin: 20px 0; text-align: center; font-size: 24px">
      <b>注册</b>
    </div>
    <el-form :model="user" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item prop="userName">
        <el-input
          size="large"
          style="margin: 10px 0"
          :prefix-icon="UserFilled"
          v-model="user.userName"
          placeholder="请输入1-20个字符作为你的用户名"
          clearable
          minlength="1"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="large"
          style="margin: 10px 0"
          :prefix-icon="Lock"
          show-password
          v-model="user.password"
          placeholder="请输入6-30个字符作为你的密码"
          clearable
          minlength="6"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item prop="confirm_password">
        <el-input
          size="large"
          style="margin: 10px 0"
          :prefix-icon="Lock"
          show-password
          v-model="user.confirm_password"
          placeholder="请重复输入一次你的密码"
          clearable
          minlength="6"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item class="el-form-button">
        <el-button
          type="primary"
          size="large"
          round
          @click="register(ruleFormRef)"
        >
          注册
        </el-button>
        <el-button
          type="success"
          size="large"
          round
          @click="router.push('/login')"
        >
          返回
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, ref } from "vue"
import { Lock, UserFilled } from "@element-plus/icons-vue"
import request from "../utils/request"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { useRouter } from "vue-router"

interface ServerResponse {
  data: ServerData
}

interface ServerData {
  code: string
  data: Array<string>
  msg: string
}

const user = reactive({
  userName: "",
  password: "",
  confirm_password: "",
})
const blur = inject("blur")
const router = useRouter()

const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码！"))
  } else {
    if (user.confirm_password !== "") {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField("checkPass", () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码！"))
  } else if (value !== user.password) {
    callback(new Error("两次输入不一致！"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 1, max: 20, message: "长度应该为1到20位", trigger: "blur" },
  ],
  password: [
    { min: 6, max: 30, message: "长度应该为6到30位", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  confirm_password: [
    { min: 6, max: 30, message: "长度应该为6到30位", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" },
  ],
})

const register = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      request
        .post<ServerResponse, ServerData>("/user/register", user)
        .then((res) => {
          if (res.code === "200") {
            ElMessage({
              message: "注册成功",
              type: "success",
            })
            localStorage.setItem("user", JSON.stringify(res.data))
            router.push("/manage/home")
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            })
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
  height: 400px;
  padding: 20px;
  border-radius: 10px;
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
