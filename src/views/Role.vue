<template>
  <div style="display: flex">
    <div class="bg_card">
      <p>权限管理</p>
      <el-select v-model="value" class="m-5">
        <el-option
          v-for="item in selectOption"
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
      <p>商品管理</p>
      <el-transfer
        class="transfer"
        :titles="['启用', '禁用']"
        v-model="disable"
        :data="tdata"
        @change="change"
        @right-check-change="rchange"
      >
        <template #left-footer>
          <div class="lf">
            <el-popover
              placement="bottom"
              :width="152"
              trigger="hover"
              content="右侧输入内容以添加"
            >
              <template #reference>
                <el-button class="transfer-footer" size="small" @click="newUp"
                  >添加
                </el-button>
              </template>
            </el-popover>
            <el-input
              v-model="newGoods"
              placeholder="新增产品"
              size="small"
              style="margin: 15px"
              clearable
            ></el-input>
          </div>
        </template>
        <template #right-footer>
          <el-popover
            placement="bottom"
            trigger="hover"
            content="此框选中商品将被删除"
          >
            <template #reference>
              <el-button class="transfer-footer" size="small" @click="del"
                >删除
              </el-button>
            </template>
          </el-popover>
        </template>
      </el-transfer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElTree } from "element-plus"
import { ref } from "vue"
import { useStore } from "../store/store"
import request from "../utils/request"

interface Tree {
  id?: number
  label: string
  children?: Tree[]
}
interface IData {
  code: string
}
interface tdataOption {
  key: number
  label: string
  disabled: boolean
}
interface GServerData {
  id: number
  name: string
  disable: boolean
}

const store = useStore()
const server = store.ServerIp
const tdata = ref<tdataOption[]>()
const disable = ref([] as number[])
const delGoods = ref([] as number[])
const newGoods = ref("")
const value = ref("admin")
const treeRef = ref<InstanceType<typeof ElTree>>()

const selectOption = [
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
  request.get<{ data: GServerData[] }, GServerData[]>("/goods").then((res) => {
    tdata.value = Array.from(res).map((item) => ({
      key: item.id,
      label: item.name,
      disabled: false,
    }))
    disable.value = res
      .filter((item) => item.disable === true)
      .map((item) => item.id)
  })
}
load()
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
    .catch((e) => {
      ElMessage.error("系统错误请联系管理员:" + e)
    })
}
const newUp = () => {
  if (
    newGoods.value != "" &&
    !tdata.value?.some((item: tdataOption) =>
      item.label.includes(newGoods.value)
    )
  ) {
    request
      .get<{ data: RServerData }, RServerData>(
        server + "/goods/up?name=" + newGoods.value
      )
      .then((res) => {
        if (res.code == "200") {
          ElMessage.success("新增成功")
          load()
        } else {
          ElMessage.error("新增失败:" + res.msg)
        }
      })
  } else {
    ElMessage.error("输入框不能为空或者重复")
  }
}
const del = () => {
  request
    .delete<{ data: RServerData }, RServerData>(server + "/goods/del", {
      data: delGoods.value,
    })
    .then((res) => {
      console.log(res)
      if (res.code === "200") {
        ElMessage.success("删除成功")
        load()
      } else {
        ElMessage.error("删除失败:" + res.msg)
      }
    })
}
const change = () => {
  let filteredArray = tdata.value
    ?.filter((item) => disable.value.includes(item.key))
    .map((item) => {
      return {
        id: item.key,
        name: item.label,
        disable: true,
      }
    })
  request
    .post<{ data: RServerData }, RServerData>(
      server + "/goods/change",
      filteredArray
    )
    .then((res) => {
      if (res.code != "200") {
        ElMessage.error("切换失败:" + res.msg)
        load()
      }
    })
}
const rchange = (del: number[]) => {
  delGoods.value = del
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
.lf {
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
}
p {
  font-size: large;
  text-align: center;
  margin-bottom: 15px;
}
</style>
