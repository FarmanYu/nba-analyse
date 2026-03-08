<template>
  <div class="team-detail">
    <el-button @click="router.back()" style="margin-bottom: 20px">
      ← 返回
    </el-button>
    
    <el-row :gutter="20" v-if="team">
      <el-col :span="8">
        <el-card>
          <div class="team-logo">🏀</div>
          <h2>{{ team.name }}</h2>
          <p class="team-info">
            <span>简称: {{ team.shortName }}</span><br>
            <span>城市: {{ team.city }}</span><br>
            <span>分区: {{ team.conference }}</span><br>
            <span>赛区: {{ team.division }}</span>
          </p>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>📊 最近比赛</span>
          </template>
          <el-table :data="matches" size="small">
            <el-table-column label="日期" width="100">
              <template #default="{ row }">
                {{ formatDate(row.gameDate) }}
              </template>
            </el-table-column>
            <el-table-column label="主队" width="150">
              <template #default="{ row }">
                {{ row.hostTeamName }}
              </template>
            </el-table-column>
            <el-table-column label="比分" width="100">
              <template #default="{ row }">
                <span :class="{ 'win': row.hostTeamId === team.teamId && row.hostScore > row.guestScore, 'lose': row.hostTeamId === team.teamId && row.hostScore < row.guestScore }">
                  {{ row.hostScore }} - {{ row.guestScore }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="客队" width="150">
              <template #default="{ row }">
                {{ row.guestTeamName }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'finished' ? 'success' : 'info'" size="small">
                  {{ row.status === 'finished' ? '已结束' : '未开始' }}
                </el-tag>
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
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { Team, Match } from '../types';

const route = useRoute();
const router = useRouter();
const team = ref<Team | null>(null);
const matches = ref<Match[]>([]);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

onMounted(async () => {
  const id = Number(route.params.id);
  const [teamRes, matchRes] = await Promise.all([
    api.getTeamById(id),
    api.getTeamMatches(id, 10)
  ]);
  
  if (teamRes.code === 0) team.value = teamRes.data;
  if (matchRes.code === 0) matches.value = matchRes.data || [];
});
</script>

<style lang="scss" scoped>
.team-detail {
  .team-logo {
    font-size: 80px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .team-info {
    line-height: 2;
    color: #666;
  }
  
  .win { color: #67c23a; font-weight: bold; }
  .lose { color: #f56c6c; font-weight: bold; }
}
</style>