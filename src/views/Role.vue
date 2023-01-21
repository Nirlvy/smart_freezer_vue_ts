<template>
  <div class="bg_card">
    <el-select v-model="value" class="m-5"  :change="load()">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        
      />
    </el-select>
    <el-tree
      ref="treeRef"
      class="m-5"
      node-key="id"
      :data="data"
      :props="props"
      show-checkbox
      default-expand-all
    />
    <el-button class="m-10" type="primary" @click="save">保存</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElTree } from "element-plus"
import { ref } from "vue"
import request from "../utils/request"

interface Tree {
  id?: number
  label: string
  children?: Tree[]
}

interface IData {
  code: string
}

const value = ref("admin")
const treeRef = ref<InstanceType<typeof ElTree>>()

const options = [
  {
    value: "admin",
    label: "管理员",
  },
  {
    value: "user",
    label: "用户",
  },
]

const props = {
  children: "children",
  label: "label",
}

const data: Tree[] = [
  {
    id: 1,
    label: "系统首页",
  },
  {
    id: 2,
    label: "管理菜单",
    children: [
      {
        id: 3,
        label: "设备管理",
      },
      {
        id: 4,
        label: "商品管理",
      },
      {
        id: 5,
        label: "库存管理",
      },
      {
        id: 6,
        label: "访问控制",
      },
    ],
  },
  {
    id: 7,
    label: "记录菜单",
    children: [
      {
        id: 8,
        label: "用户记录",
      },
    ],
  },
]

const load = () => {
  request.get("/roleMenu/" + value.value).then((res) => {
    treeRef.value!.setCheckedKeys(res.data)
  })
}

const save = () => {
  request
    .post<{ data: IData }, IData>(
      "/roleMenu/" + value.value,
      treeRef.value!.getCheckedKeys(false)
    )
    .then((res) => {
      if (res.code === "200") {
        ElMessage.success("修改成功")
      }
    })
    .catch(() => {
      ElMessage.error("系统错误请联系管理员")
    })
}
</script>

<style scoped>
.bg_card {
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
</style>
