<template>
  <el-dialog v-model="MainStore.dialog" title="检测到商品" width="330">
    <el-form>
      <el-form-item label="商品:">{{ MainStore.imgBase64[1] }}</el-form-item>
      <el-form-item label="图片:">
        <el-image style="width: 200px; height: 200px" :src="MainStore.imgBase64[0]" :preview-src-list="[MainStore.imgBase64[0]]" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store/store'

const MainStore = useMainStore()
</script>

<style scoped></style>
