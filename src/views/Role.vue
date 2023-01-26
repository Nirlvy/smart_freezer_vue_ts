<template>
  <div style="display: flex">
    <div class="bg_card">
      <el-select v-model="value" class="m-5">
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
    <div class="bg_card">
      <el-transfer
        class="transfer"
        :titles="['启用', '禁用']"
        v-model="tvalue"
        :data="tdata"
      >
        <template #left-footer>
          <div style="display: flex">
            <el-button class="transfer-footer" size="small">添加</el-button>
            <el-input v-model="a" placeholder=""></el-input>
          </div>
        </template>
        <template #right-footer>
          <el-button class="transfer-footer" size="small">删除</el-button>
        </template>
      </el-transfer>
    </div>
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
interface Option {
  key: string
  label: string
  disabled: boolean
}
interface GServerData {
  id: number
  name: string
  enable: boolean
}

const tdata = ref<Option[]>()
const tvalue = ref([])

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
        label: "访问控制",
      },
    ],
  },
  {
    id: 6,
    label: "记录菜单",
    children: [
      {
        id: 7,
        label: "用户记录",
      },
    ],
  },
]

const load = () => {
  request.get("/roleMenu/" + value.value).then((res) => {
    treeRef.value!.setCheckedKeys(res.data)
  })
  let key = 1
  request.get<{ data: GServerData[] }, GServerData[]>("/goods").then((res) => {
    tdata.value = Array.from(res).map((item) => ({
      key: item.name,
      label: item.name,
      disabled: false,
    }))
  })
}
load()
const save = () => {
  // request
  //   .post<{ data: IData }, IData>(
  //     "/roleMenu/" + value.value,
  //     treeRef.value!.getCheckedKeys(false)
  //   )
  //   .then((res) => {
  //     if (res.code === "200") {
  //       ElMessage.success("修改成功")
  //     }
  //   })
  //   .catch(() => {
  //     ElMessage.error("系统错误请联系管理员")
  //   })
  console.log(tvalue.value)
}
</script>

<style scoped>
.bg_card {
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #999;
}
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}
.transfer
  :deep()
  .el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label
  span {
  right: -110px !important;
}
</style>
