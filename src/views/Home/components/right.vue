<template>
  <el-card class="firstCard cardLine">
    <div class="card-title">信息</div>
    <el-row>
      <el-col :span="12">
        <div class="tone">
          <Mug class="icon" />
          <div class="card-text">卡片内容1</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="tone">
          <Mug class="icon" />
          <div class="card-text">卡片内容1</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="tone">
          <Mug class="icon" />
          <div class="card-text">卡片内容1</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="tone">
          <Mug class="icon" />
          <div class="card-text">卡片内容1</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-col :span="24"></el-col>
</template>

<script setup lang="ts">
import { Mug } from '@element-plus/icons-vue'
</script>

<style scoped>
.firstCard {
  height: 209.38px;
}
.cardLine {
  margin-bottom: 10px;
}
.tone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
}
.icon {
  width: 20%;
}
</style>
