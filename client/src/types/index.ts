// 球队类型
export interface Team {
  _id?: string;
  teamId: number;
  name: string;
  shortName: string;
  city: string;
  conference: string;
  division?: string;
  logo?: string;
  colors?: string[];
  arena?: string;
}

// 球员类型
export interface Player {
  _id?: string;
  playerId: number;
  name: string;
  englishName?: string;
  teamId: number;
  position?: string;
  number?: string;
  height?: string;
  weight?: string;
  birthday?: string;
  country?: string;
  draftYear?: number;
  salary?: number;
  avatar?: string;
}

// 比赛类型
export interface Match {
  _id?: string;
  matchId: number;
  season: string;
  seasonYear: number;
  gameDate: string;
  timestamp: number;
  
  hostTeamId: number;
  hostTeamName: string;
  hostScore: number;
  hostQuarterScore?: number[];
  
  guestTeamId: number;
  guestTeamName: string;
  guestScore: number;
  guestQuarterScore?: number[];
  
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  type: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}