<template>
  <div class="bg">
    <div class="tip">
      <div class="code">404</div>
      <div class="text">ops~ 你访问的页面不存在</div>
      <div class="back">
        <router-link to="/" style="text-decoration: none">
          <el-button type="primary" size="large">返回首页</el-button>
        </router-link>
        <el-button
          style="margin-left: 150px"
          type="primary"
          size="large"
          @click="router.go(-1)"
          >返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.bg {
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(to bottom right, #24292f, #64b2e0);
}
.tip {
  margin: 200px auto;
  text-align: center;
}
.code {
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #6db9e5;
}
.text {
  font-size: 30px;
}
.back {
  margin-top: 30px;
}
</style>
