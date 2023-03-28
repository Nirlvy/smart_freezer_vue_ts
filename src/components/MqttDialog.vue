<template>
  <el-dialog v-model="MainStore.dialog" title="检测到商品" width="330">
    <el-form>
      <el-form-item label="商品:">{{ dialog[1] }}</el-form-item>
      <el-form-item label="图片:">
        <el-image style="width: 200px; height: 200px" :src="dialog[0]" :preview-src-list="[dialog[0]]" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store/store'
import { ref, watch } from 'vue'

const MainStore = useMainStore()
const dialog = ref<string[]>([])

watch(
  () => MainStore.dialog,
  (nv) => {
    if (nv === true) {
      dialog.value.length = 0
      init()
    }
  }
)

const init = () => {
  let split = MainStore.imgBase64.split('-')
  split.forEach((item) => {
    dialog.value.push(item)
  })
}
</script>

<style scoped></style>
