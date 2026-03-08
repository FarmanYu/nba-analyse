<template>
  <div class="player-detail">
    <el-button @click="router.back()" style="margin-bottom: 20px">← 返回</el-button>
    <el-card v-if="player">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="player-avatar">👤</div>
          <h2>{{ player.name }}</h2>
          <p>{{ player.englishName }}</p>
        </el-col>
        <el-col :span="18">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="球衣号码">{{ player.number }}</el-descriptions-item>
            <el-descriptions-item label="位置">{{ player.position }}</el-descriptions-item>
            <el-descriptions-item label="身高">{{ player.height }}</el-descriptions-item>
            <el-descriptions-item label="体重">{{ player.weight }}</el-descriptions-item>
            <el-descriptions-item label="国籍">{{ player.country }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ player.birthday }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { Player } from '../types';

const route = useRoute();
const router = useRouter();
const player = ref<Player | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  const res = await api.getPlayerById(id);
  if (res.code === 0) player.value = res.data;
});
</script>

<style scoped>
.player-detail .player-avatar { font-size: 100px; text-align: center; }
</style>