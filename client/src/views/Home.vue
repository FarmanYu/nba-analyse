<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>🏀 球队总数</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.teams }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>👤 球员总数</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.players }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📅 比赛总数</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.matches }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📊 赛季</span>
            </div>
          </template>
          <div class="stat-value">{{ currentSeason }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>🏆 东部排名</span>
          </template>
          <el-table :data="eastRankings" size="small">
            <el-table-column prop="rank" label="排名" width="60" />
            <el-table-column prop="shortName" label="球队" />
            <el-table-column prop="wins" label="胜" width="50" />
            <el-table-column prop="losses" label="负" width="50" />
            <el-table-column prop="winPercentage" label="胜率" width="70">
              <template #default="{ row }">
                {{ (row.winPercentage * 100).toFixed(1) }}%
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>🏆 西部排名</span>
          </template>
          <el-table :data="westRankings" size="small">
            <el-table-column prop="rank" label="排名" width="60" />
            <el-table-column prop="shortName" label="球队" />
            <el-table-column prop="wins" label="胜" width="50" />
            <el-table-column prop="losses" label="负" width="50" />
            <el-table-column prop="winPercentage" label="胜率" width="70">
              <template #default="{ row }">
                {{ (row.winPercentage * 100).toFixed(1) }}%
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import { Team } from '../types';

const stats = ref({ teams: 30, players: 0, matches: 0 });
const currentSeason = ref('2024-2025');
const eastRankings = ref<(Team & { rank: number; wins: number; losses: number; winPercentage: number })[]>([]);
const westRankings = ref<(Team & { rank: number; wins: number; losses: number; winPercentage: number })[]>([]);

onMounted(async () => {
  try {
    // 获取排名数据
    const [eastRes, westRes] = await Promise.all([
      api.getTeamRankings('东部'),
      api.getTeamRankings('西部')
    ]);
    
    if (eastRes.code === 0 && eastRes.data) {
      eastRankings.value = eastRes.data.slice(0, 10);
    }
    if (westRes.code === 0 && westRes.data) {
      westRankings.value = westRes.data.slice(0, 10);
    }
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
  }
});
</script>

<style lang="scss" scoped>
.home {
  .stat-value {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    color: #409eff;
  }
  
  .card-header {
    font-weight: 600;
  }
}
</style>