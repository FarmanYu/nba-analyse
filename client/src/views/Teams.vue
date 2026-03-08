<template>
  <div class="teams">
    <!-- 筛选 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="分区">
          <el-select v-model="filters.conference" placeholder="全部" clearable @change="handleSearch">
            <el-option label="东部" value="东部" />
            <el-option label="西部" value="西部" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="filters.keyword" placeholder="球队名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 球队列表 -->
    <el-card style="margin-top: 20px">
      <el-table :data="teams" v-loading="loading" stripe>
        <el-table-column prop="teamId" label="ID" width="60" />
        <el-table-column prop="logo" label="队标" width="60">
          <template #default="{ row }">
            <span style="font-size: 24px">🏀</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="球队名称" />
        <el-table-column prop="shortName" label="简称" width="100" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="conference" label="分区" width="80">
          <template #default="{ row }">
            <el-tag :type="row.conference === '东部' ? 'success' : 'warning'" size="small">
              {{ row.conference }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="division" label="赛区" width="80" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row.teamId)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTeamStore } from '../stores/team';

const router = useRouter();
const teamStore = useTeamStore();

const teams = ref<any[]>([]);
const loading = ref(false);
const filters = reactive({
  conference: '',
  keyword: ''
});
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});

const handleSearch = async () => {
  loading.value = true;
  try {
    const res = await teamStore.fetchTeams({
      page: pagination.page,
      pageSize: pagination.pageSize,
      conference: filters.conference || undefined,
      keyword: filters.keyword || undefined
    });
    teams.value = teamStore.teams;
    pagination.total = teamStore.pagination.total;
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  filters.conference = '';
  filters.keyword = '';
  handleSearch();
};

const viewDetail = (id: number) => {
  router.push(`/teams/${id}`);
};

onMounted(() => {
  handleSearch();
});
</script>