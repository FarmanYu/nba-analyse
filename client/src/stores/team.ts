import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';
import { Team } from '../types';

export const useTeamStore = defineStore('team', () => {
  const teams = ref<Team[]>([]);
  const currentTeam = ref<Team | null>(null);
  const rankings = ref<Team[]>([]);
  const loading = ref(false);
  const pagination = ref({ page: 1, pageSize: 20, total: 0 });

  async function fetchTeams(params?: {
    page?: number;
    pageSize?: number;
    conference?: string;
    keyword?: string;
  }) {
    loading.value = true;
    try {
      const res = await api.getTeams(params);
      if (res.code === 0 && res.data) {
        teams.value = res.data;
        if (res.pagination) {
          pagination.value = res.pagination;
        }
      }
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeamById(id: number) {
    loading.value = true;
    try {
      const res = await api.getTeamById(id);
      if (res.code === 0 && res.data) {
        currentTeam.value = res.data;
      }
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRankings(conference?: string) {
    loading.value = true;
    try {
      const res = await api.getTeamRankings(conference);
      if (res.code === 0 && res.data) {
        rankings.value = res.data;
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    teams,
    currentTeam,
    rankings,
    loading,
    pagination,
    fetchTeams,
    fetchTeamById,
    fetchRankings
  };
});