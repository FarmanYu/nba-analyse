<template>
  <div class="matches">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="赛季">
          <el-select v-model="filters.season" @change="handleSearch">
            <el-option label="2024-2025" value="2024-2025" />
            <el-option label="2023-2024" value="2023-2024" />
          </el-select>
        </el-form-item>
        <el-form-item label="球队">
          <el-select v-model="filters.teamId" placeholder="全部" clearable @change="handleSearch">
            <el-option v-for="t in teams" :key="t.teamId" :label="t.name" :value="t.teamId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="matches" v-loading="loading" stripe>
        <el-table-column label="日期" width="120">
          <template #default="{ row }">{{ formatDate(row.gameDate) }}</template>
        </el-table-column>
        <el-table-column label="主队" width="180">
          <template #default="{ row }">{{ row.hostTeamName }}</template>
        </el-table-column>
        <el-table-column label="比分" width="120">
          <template #default="{ row }">
            <span :class="getScoreClass(row)">{{ row.hostScore }} - {{ row.guestScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客队" width="180">
          <template #default="{ row }">{{ row.guestTeamName }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row.matchId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Team, Match } from '../types';

const router = useRouter();
const teams = ref<Team[]>([]);
const matches = ref<Match[]>([]);
const loading = ref(false);
const filters = reactive({ season: '2024-2025', teamId: null as number | null });
const pagination = reactive({ page: 1, pageSize: 20, total: 0 });

const formatDate = (d: string) => new Date(d).toLocaleDateString('zh-CN');
const getScoreClass = (row: Match) => row.status === 'finished' ? '' : 'pending';
const getStatusType = (s: string) => s === 'finished' ? 'success' : s === 'live' ? 'danger' : 'info';
const getStatusText = (s: string) => s === 'finished' ? '已结束' : s === 'live' ? '进行中' : '未开始';
const viewDetail = (id: number) => router.push(`/matches/${id}`);

const handleSearch = async () => {
  loading.value = true;
  try {
    const res = await api.getMatches({
      page: pagination.page, pageSize: pagination.pageSize,
      season: filters.season, teamId: filters.teamId || undefined
    });
    if (res.code === 0) { matches.value = res.data || []; pagination.total = res.pagination?.total || 0; }
  } finally { loading.value = false; }
};
onMounted(async () => {
  const res = await api.getTeams({ pageSize: 100 });
  if (res.code === 0) teams.value = res.data || [];
  handleSearch();
});
</script>

<style scoped>
.pending { color: #999; }
</style>