<template>
  <div class="match-detail">
    <el-button @click="router.back()" style="margin-bottom: 20px">← 返回</el-button>
    <el-card v-if="match">
      <div class="match-header">
        <div class="team">{{ match.hostTeamName }}</div>
        <div class="score">
          <span :class="{ winner: match.hostScore > match.guestScore }">{{ match.hostScore }}</span>
          <span>-</span>
          <span :class="{ winner: match.guestScore > match.hostScore }">{{ match.guestScore }}</span>
        </div>
        <div class="team">{{ match.guestTeamName }}</div>
      </div>
      <div class="match-info">
        <p>📅 日期: {{ formatDate(match.gameDate) }}</p>
        <p>🏆 赛季: {{ match.season }}</p>
        <p>📊 状态: {{ match.status === 'finished' ? '已结束' : '未开始' }}</p>
      </div>
      <el-card v-if="match.hostQuarterScore && match.hostQuarterScore.length" style="margin-top: 20px">
        <template #header>📈 得分趋势</template>
        <div class="quarters">
          <div v-for="(score, idx) in match.hostQuarterScore" :key="idx" class="quarter">
            <div class="q-name">第{{ idx + 1 }}节</div>
            <div class="q-host">{{ score }}</div>
            <div class="q-guest">{{ match.guestQuarterScore?.[idx] || 0 }}</div>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { Match } from '../types';

const route = useRoute();
const router = useRouter();
const match = ref<Match | null>(null);

const formatDate = (d: string) => new Date(d).toLocaleString('zh-CN');

onMounted(async () => {
  const id = Number(route.params.id);
  const res = await api.getMatchById(id);
  if (res.code === 0) match.value = res.data;
});
</script>

<style scoped>
.match-detail .match-header { display: flex; justify-content: space-around; align-items: center; padding: 30px 0; }
.match-detail .team { font-size: 20px; font-weight: bold; }
.match-detail .score { font-size: 40px; font-weight: bold; }
.match-detail .score span { margin: 0 10px; }
.match-detail .winner { color: #67c23a; }
.match-detail .match-info { text-align: center; color: #666; line-height: 2; }
.match-detail .quarters { display: flex; justify-content: space-around; }
.match-detail .quarter { text-align: center; }
.match-detail .q-name { font-weight: bold; margin-bottom: 10px; }
.match-detail .q-host { color: #409eff; font-size: 20px; }
.match-detail .q-guest { color: #67c23a; font-size: 20px; }
</style>