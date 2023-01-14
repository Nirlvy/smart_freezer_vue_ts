<template>
  <el-container class="layout-container">
    <el-header>
      <Header />
    </el-header>

    <el-container>
      <el-container>
        <el-aside>
          <Aside />
        </el-aside>
      </el-container>

      <el-container style="width: 100%">
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from "./Aside.vue"
import Header from "./Header.vue"
</script>

<style scoped>
.layout-container {
  display: flex;
  align-items: stretch;
}

.layout-container .el-header {
  position: relative;
  background-color: #263146;
  color: white;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.layout-container .el-aside {
  color: var(--el-text-color-primary);
  background: #334058;
  width: auto;
  flex-basis: 0;
  flex-grow: 1;
}

.layout-container .el-main {
  margin: 0;
  padding: 0;
}

body {
  background-color: white;
}
</style>
