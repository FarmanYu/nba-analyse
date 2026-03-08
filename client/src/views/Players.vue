<template>
  <div class="players">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="球队">
          <el-select v-model="filters.teamId" placeholder="全部" clearable @change="handleSearch">
            <el-option v-for="t in teams" :key="t.teamId" :label="t.name" :value="t.teamId" />
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="filters.position" placeholder="全部" clearable @change="handleSearch">
            <el-option label="控卫 (PG)" value="PG" />
            <el-option label="分卫 (SG)" value="SG" />
            <el-option label="小前锋 (SF)" value="SF" />
            <el-option label="大前锋 (PF)" value="PF" />
            <el-option label="中锋 (C)" value="C" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="filters.keyword" placeholder="球员姓名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="players" v-loading="loading" stripe>
        <el-table-column prop="playerId" label="ID" width="60" />
        <el-table-column prop="avatar" label="头像" width="60">
          <template #default>
            <span style="font-size: 24px">👤</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="englishName" label="英文名" />
        <el-table-column prop="position" label="位置" width="80" />
        <el-table-column prop="number" label="球衣" width="60" />
        <el-table-column prop="height" label="身高" width="80" />
        <el-table-column prop="weight" label="体重" width="80" />
        <el-table-column prop="country" label="国籍" width="80" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row.playerId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
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
import { Team, Player } from '../types';

const router = useRouter();
const teams = ref<Team[]>([]);
const players = ref<Player[]>([]);
const loading = ref(false);
const filters = reactive({ teamId: null as number | null, position: '', keyword: '' });
const pagination = reactive({ page: 1, pageSize: 20, total: 0 });

const handleSearch = async () => {
  loading.value = true;
  try {
    const res = await api.getPlayers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      teamId: filters.teamId || undefined,
      position: filters.position || undefined,
      keyword: filters.keyword || undefined
    });
    if (res.code === 0) {
      players.value = res.data || [];
      pagination.total = res.pagination?.total || 0;
    }
  } finally {
    loading.value = false;
  }
};

const viewDetail = (id: number) => router.push(`/players/${id}`);
const loadTeams = async () => {
  const res = await api.getTeams({ pageSize: 100 });
  if (res.code === 0) teams.value = res.data || [];
};

onMounted(() => { loadTeams(); handleSearch(); });
</script>