<template>
  <el-row class="row" :gutter="10" justify="space-around">
    <el-col :span="6">
      <el-card>
        <div class="card-title">本月销售额</div>
        <div class="card-value">¥{{ cardValue.monthSold }}</div>
        <div class="blank" />
        <div class="card-text">
          <div>
            <span>月间比</span>
            <span class="value">{{ cardValue.monthRadio }}</span>
          </div>
          <div>
            <span>月环比</span>
            <span class="value">{{ cardValue.monthBasis }}</span>
          </div>
        </div>
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均销售额</span>
            <span class="value">¥{{ cardValue.dayAveSold }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">月上架数</div>
        <div class="card-value">{{ cardValue.monthUp }}</div>
        <div class="card-chart" />
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均上架数</span>
            <span class="value">{{ cardValue.dayAveUp }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">售出率</div>
        <div class="card-value">{{ cardValue.soldRate }}%</div>
        <div class="card-chart" />
        <el-divider />
        <div class="card-text">
          <div>
            <span>月均售出率</span>
            <span class="value">{{ cardValue.monSoldRate }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div class="card-title">月目标数</div>
        <div class="card-value">{{ cardValue.monthTarget }}</div>
        <div class="card-chart" />
        <el-divider />
        <div class="card-text">
          <div>
            <span>日均目标数</span>
            <span class="value">{{ cardValue.dayTarget }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="24">
      <el-card>
        <div class="card-title">快速发起</div>
        <div class="shortCutLine">
          <div v-for="item in 10" :key="item" class="shortCut">
            <Cpu />
            <div>出库</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="row echartsRow" :gutter="10" justify="space-around">
    <el-col :span="12">
      <bchart />
    </el-col>
    <el-col :span="12">
      <bchart2 />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import bchart from './bchart.vue'
import bchart2 from './bchart2.vue'

const cardValue = reactive({
  monthSold: 0,
  monthRadio: 0,
  monthBasis: 0,
  dayAveSold: 0,
  monthUp: 0,
  dayAveUp: 0,
  soldRate: 0,
  monSoldRate: 0,
  monthTarget: 0,
  dayTarget: 0,
})
</script>

<style scoped>
.card-chart {
  height: 40.8px;
}
.shortCutLine {
  padding: 5px;
  font-size: small;
  white-space: nowrap;
}
.shortCut {
  margin: 10px 20px 0;
  display: inline-block;
  text-align: center;
}
.echartsRow {
  height: 35%;
}
.blank {
  height: 20px;
}
</style>

<style>
.el-card__body {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.echartCard {
  height: 100%;
}
.echartCardtitle {
  display: flex;
  justify-content: space-between;
}
</style>
