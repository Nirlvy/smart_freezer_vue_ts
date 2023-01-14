<template>
  <div class="toolbar">
    <div style="margin-left: 20px">
      <span style="font-size: large">智能冰柜管理系统</span>
      <el-breadcrumb
        style="display: inline-block; margin-left: 20px; font-size: 16px"
        ><el-breadcrumb-item class="breadcrumb" :to="{ path: '/manage/home' }"
          >首页</el-breadcrumb-item
        ><template v-for="(item, index) in breadList"
          ><el-breadcrumb-item v-if="item.name" :key="index" :to="item.path">{{
            item.name
          }}</el-breadcrumb-item></template
        ></el-breadcrumb
      >
    </div>
    <div style="display: flex">
      <el-dropdown style="width: 30px float: right">
        <el-icon style="margin-right: 8px; margin-top: 1px" :size="25">
          <setting />
        </el-icon>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/manage/person" style="text-decoration: none"
              ><el-dropdown-item>个人中心</el-dropdown-item></router-link
            >
            <span @click="logout">
              <el-dropdown-item>退出登录</el-dropdown-item></span
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <img class="avatar" :src="user.img" />
      <span style="margin-right: 20px; line-height: 30px">{{
        user.userName
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Setting } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const breadList = ref(route.matched)
watch(route, () => {
  breadList.value = route.matched
})
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "0")
  : {}

const logout = () => {
  router.push("/login")
  localStorage.removeItem("user")
  ElMessage({
    message: "退出成功",
    type: "success",
  })
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.breadcrumb :deep() .el-breadcrumb__inner {
  color: white;
  font-weight: 400;
  /* color: var(--el-text-color-primary); */
}

.breadcrumb:hover :deep() .el-breadcrumb__inner {
  color: #388ae6;
}

.avatar {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
