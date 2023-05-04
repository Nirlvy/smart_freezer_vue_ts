<template>
  <div class="toolbar">
    <div style="margin-left: 20px">
      <span style="font-size: large">智能冰柜管理系统</span>
    </div>
    <div style="display: flex">
      <el-dropdown style="width: 30px float: right">
        <el-icon style="margin-right: 8px; margin-top: 1px" :size="25">
          <setting />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/manage/person" style="text-decoration: none"><el-dropdown-item>个人中心</el-dropdown-item> </router-link>
            <span @click="logout"><el-dropdown-item>退出登录</el-dropdown-item></span>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <img v-if="user.img != null" class="avatar" :src="user.img" /> -->
      <span style="margin-right: 20px; line-height: 30px">{{ Jwt.sub }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store/store'

const router = useRouter()
const store = useMainStore()
const Jwt = store.Jwt

const logout = () => {
  store.$reset()
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
.avatar {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
