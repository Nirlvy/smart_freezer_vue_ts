<template>
  <div class="toolbar">
    <div style="margin-left: 20px">
      <span style="font-size: large">智能冰柜管理系统</span>
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item
          class="breadcrumb-item"
          :to="{ path: '/manage/home' }"
          >首页
        </el-breadcrumb-item>
        <template v-for="(item, index) in breadList">
          <el-breadcrumb-item v-if="item.name" :key="index" :to="item.path">{{
            item.name
          }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div style="display: flex">
      <el-dropdown style="width: 30px float: right">
        <el-icon style="margin-right: 8px; margin-top: 1px" :size="25">
          <setting />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/manage/person" style="text-decoration: none"
              ><el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <span @click="logout">
              <el-dropdown-item>退出登录</el-dropdown-item></span
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <img v-if="user.img != null" class="avatar" :src="user.img" />
      <span style="margin-right: 20px; line-height: 30px">{{
        user.userName
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store/store'

const route = useRoute()
const router = useRouter()
const store = useStore()
const breadList = ref(route.matched)
watch(route, () => {
  breadList.value = route.matched
})
const user = store.user

const logout = () => {
  router.push('/login')
  ElMessage.success('退出成功')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.breadcrumb {
  display: inline-block;
  margin-left: 20px;
  font-size: 16px;
}

.breadcrumb-item :deep() .el-breadcrumb__inner {
  color: white;
  font-weight: 400;
}

.breadcrumb-item:hover :deep() .el-breadcrumb__inner {
  color: #388ae6;
}

.avatar {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
