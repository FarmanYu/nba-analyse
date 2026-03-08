import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Team, Player, Match, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response.data,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // ===== 球队 API =====
  async getTeams(params?: {
    page?: number;
    pageSize?: number;
    conference?: string;
    division?: string;
    keyword?: string;
  }): Promise<ApiResponse<Team[]>> {
    return this.client.get('/teams', { params });
  }

  async getTeamById(id: number): Promise<ApiResponse<Team>> {
    return this.client.get(`/teams/${id}`);
  }

  async getTeamRankings(conference?: string): Promise<ApiResponse<Team[]>> {
    return this.client.get('/teams/rankings', { params: { conference } });
  }

  async getTeamsByDivision(conference?: string, division?: string): Promise<ApiResponse<any>> {
    return this.client.get('/teams/division', { params: { conference, division } });
  }

  // ===== 球员 API =====
  async getPlayers(params?: {
    page?: number;
    pageSize?: number;
    teamId?: number;
    position?: string;
    keyword?: string;
  }): Promise<ApiResponse<Player[]>> {
    return this.client.get('/players', { params });
  }

  async getPlayerById(id: number): Promise<ApiResponse<Player>> {
    return this.client.get(`/players/${id}`);
  }

  async getPlayersByTeam(teamId: number): Promise<ApiResponse<Player[]>> {
    return this.client.get(`/players/team/${teamId}`);
  }

  async searchPlayers(q: string, limit?: number): Promise<ApiResponse<Player[]>> {
    return this.client.get('/players/search', { params: { q, limit } });
  }

  async comparePlayers(ids: number[]): Promise<ApiResponse<Player[]>> {
    return this.client.get('/players/compare', { params: { ids: ids.join(',') } });
  }

  // ===== 比赛 API =====
  async getMatches(params?: {
    page?: number;
    pageSize?: number;
    season?: string;
    teamId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<Match[]>> {
    return this.client.get('/matches', { params });
  }

  async getMatchById(id: number): Promise<ApiResponse<Match>> {
    return this.client.get(`/matches/${id}`);
  }

  async getTeamMatches(teamId: number, count?: number): Promise<ApiResponse<Match[]>> {
    return this.client.get(`/matches/team/${teamId}`, { params: { count } });
  }

  async getUpcomingMatches(date?: string): Promise<ApiResponse<Match[]>> {
    return this.client.get('/matches/upcoming', { params: { date } });
  }

  async getSeasonSchedule(seasonYear?: number, teamId?: number): Promise<ApiResponse<any>> {
    return this.client.get('/matches/schedule', { params: { seasonYear, teamId } });
  }

  async getMatchStats(teamId?: number): Promise<ApiResponse<any>> {
    return this.client.get('/matches/stats', { params: { teamId } });
  }

  // ===== 管理 API =====
  async syncTeams(): Promise<ApiResponse<number>> {
    return this.client.post('/admin/sync/teams');
  }

  async syncPlayers(): Promise<ApiResponse<number>> {
    return this.client.post('/admin/sync/players');
  }

  async syncMatches(seasonYear?: number): Promise<ApiResponse<number>> {
    return this.client.post('/admin/sync/matches', { seasonYear });
  }

  async syncAll(): Promise<ApiResponse<any>> {
    return this.client.post('/admin/sync/all');
  }

  async initialize(): Promise<ApiResponse<any>> {
    return this.client.post('/init');
  }
}

export const api = new ApiClient();
export default api;