<template>
  <el-row :gutter="5">
    <el-col :span="8"></el-col>
    <el-col :span="8"></el-col>
    <el-col :span="4"></el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useFreezerStore } from '@/store/store'
import { getDeviceProfile, getScope } from '@/utils/commonRequset'

const FreezerStore = useFreezerStore()
let profile: deviceProfile

const init = async () => {
  await getDeviceProfile(FreezerStore.chooseRow.deviceProfileId.id).then((res) => {
    if (!res) {
      return
    }
    profile = res
  })
  getScope(FreezerStore.chooseRow.id.id, 'device')
}
init()
</script>

<style scoped></style>
