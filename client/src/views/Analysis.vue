<template>
  <div class="analysis">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>📊 数据分析</span>
          </template>
          <el-form :inline="true">
            <el-form-item label="选择球队">
              <el-select v-model="selectedTeam" placeholder="全部球队" @change="loadStats">
                <el-option v-for="t in teams" :key="t.teamId" :label="t.name" :value="t.teamId" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadStats">加载数据</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>🏀 得分分布</template>
          <div ref="scoreChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>📈 比赛趋势</template>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header>🏆 胜率统计</template>
          <div ref="winRateChart" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>🏠 主场/客场</template>
          <div ref="homeChart" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>📊 场均数据</template>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="label">场均得分</span>
              <span class="value">108.5</span>
            </div>
            <div class="stat-item">
              <span class="label">场均篮板</span>
              <span class="value">45.2</span>
            </div>
            <div class="stat-item">
              <span class="label">场均助攻</span>
              <span class="value">25.8</span>
            </div>
            <div class="stat-item">
              <span class="label">场均失误</span>
              <span class="value">14.3</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import api from '../api';
import { Team } from '../types';

const teams = ref<Team[]>([]);
const selectedTeam = ref<number | null>(null);

const scoreChart = ref<HTMLElement>();
const trendChart = ref<HTMLElement>();
const winRateChart = ref<HTMLElement>();
const homeChart = ref<HTMLElement>();

const initCharts = () => {
  // 得分分布图
  if (scoreChart.value) {
    const chart = echarts.init(scoreChart.value);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['90-100', '100-110', '110-120', '120-130', '130+'] },
      yAxis: { type: 'value' },
      series: [{
        data: [5, 15, 25, 12, 3],
        type: 'bar',
        itemStyle: { color: '#409eff' }
      }]
    });
  }

  // 比赛趋势图
  if (trendChart.value) {
    const chart = echarts.init(trendChart.value);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['10月', '11月', '12月', '1月', '2月', '3月', '4月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '胜', type: 'line', data: [8, 12, 10, 14, 8, 12, 10], smooth: true, itemStyle: { color: '#67c23a' } },
        { name: '负', type: 'line', data: [4, 6, 8, 4, 6, 6, 8], smooth: true, itemStyle: { color: '#f56c6c' } }
      ]
    });
  }

  // 胜率图
  if (winRateChart.value) {
    const chart = echarts.init(winRateChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 65, name: '胜场' },
          { value: 35, name: '负场' }
        ],
        itemStyle: { color: ['#67c23a', '#f56c6c'] }
      }]
    });
  }

  // 主场/客场图
  if (homeChart.value) {
    const chart = echarts.init(homeChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: '主场胜利' },
          { value: 10, name: '主场失败' },
          { value: 30, name: '客场胜利' },
          { value: 25, name: '客场失败' }
        ],
        itemStyle: { color: ['#67c23a', '#f56c6c', '#409eff', '#e6a23c'] }
      }]
    });
  }
};

const loadStats = async () => {
  if (selectedTeam.value) {
    const res = await api.getMatchStats(selectedTeam.value);
    console.log('Stats:', res);
  }
  await nextTick();
  initCharts();
};

onMounted(async () => {
  const res = await api.getTeams({ pageSize: 100 });
  if (res.code === 0) teams.value = res.data || [];
  loadStats();
});
</script>

<style scoped>
.analysis .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.analysis .stat-item { text-align: center; padding: 15px; background: #f5f7fa; border-radius: 8px; }
.analysis .stat-item .label { display: block; color: #666; font-size: 14px; }
.analysis .stat-item .value { display: block; font-size: 24px; font-weight: bold; color: #409eff; margin-top: 5px; }
</style>