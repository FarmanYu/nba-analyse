<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <div class="logo">
          <span>🏀 NBA数据分析</span>
        </div>
        <el-menu
          :default-active="route.path"
          router
          background-color="#1a1a2e"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/teams">
            <el-icon><User /></el-icon>
            <span>球队</span>
          </el-menu-item>
          <el-menu-item index="/players">
            <el-icon><UserFilled /></el-icon>
            <span>球员</span>
          </el-menu-item>
          <el-menu-item index="/matches">
            <el-icon><Calendar /></el-icon>
            <span>比赛</span>
          </el-menu-item>
          <el-menu-item index="/analysis">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体 -->
      <el-container>
        <!-- 顶部 -->
        <el-header>
          <div class="header-title">{{ route.meta.title }}</div>
          <div class="header-actions">
            <el-button type="primary" @click="refreshData" :loading="loading">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </el-header>

        <!-- 内容 -->
        <el-main>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { HomeFilled, User, UserFilled, Calendar, DataAnalysis, Refresh } from '@element-plus/icons-vue';
import { useTeamStore } from './stores/team';

const route = useRoute();
const loading = ref(false);
const teamStore = useTeamStore();

const refreshData = async () => {
  loading.value = true;
  try {
    await teamStore.fetchTeams();
    ElMessage.success('数据刷新成功');
  } catch (error) {
    ElMessage.error('数据刷新失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100vh;
  overflow: hidden;
}

.app-container {
  height: 100%;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #16213e;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.el-aside {
  background-color: #1a1a2e;
}

.el-menu {
  border-right: none;
}

.el-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>