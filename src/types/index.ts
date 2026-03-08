// 球队类型
export interface Team {
  _id?: string;
  teamId: number;           // 球队ID
  name: string;             // 球队名称
  shortName: string;        // 简称
  city: string;             // 城市
  conference: string;       // 所属分区 (东部/西部)
  division: string;         // 所属赛区
  logo?: string;            // 队标
  colors?: string[];        // 球队颜色
  arena?: string;           // 主场球馆
  createdAt: Date;
  updatedAt: Date;
}

// 球员类型
export interface Player {
  _id?: string;
  playerId: number;         // 球员ID
  name: string;             // 球员姓名
  englishName: string;      // 英文名
  teamId: number;           // 所属球队ID
  position: string;         // 位置 (PG/SG/SF/PF/C)
  number: string;           // 球衣号码
  height: string;           // 身高
  weight: string;           // 体重
  birthday: string;         // 出生日期
  country: string;          // 国籍
  draftYear?: number;       // 选秀年份
  salary?: number;          // 薪资
  avatar?: string;          // 头像
  createdAt: Date;
  updatedAt: Date;
}

// 比赛类型
export interface Match {
  _id?: string;
  matchId: number;          // 比赛ID
  season: string;          // 赛季
  seasonYear: number;      // 赛季年份
  gameDate: Date;          // 比赛日期
  timestamp: number;       // 时间戳
  
  hostTeamId: number;      // 主队ID
  hostTeamName: string;    // 主队名称
  hostScore: number;       // 主队得分
  hostQuarterScore?: number[]; // 各节得分
  
  guestTeamId: number;    // 客队ID
  guestTeamName: string;  // 客队名称
  guestScore: number;     // 客队得分
  guestQuarterScore?: number[]; // 各节得分
  
  status: MatchStatus;     // 比赛状态
  type: MatchType;         // 比赛类型 (常规赛/季后赛)
  boxScore?: BoxScore;     // 技术统计
  
  createdAt: Date;
  updatedAt: Date;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';
export type MatchType = 1 | 2; // 1: 季前赛, 2: 常规赛, 3: 季后赛

// 技术统计
export interface BoxScore {
  [teamId: number]: {
    points: number;         // 得分
    assists: number;        // 助攻
    rebounds: number;      // 篮板
    steals: number;         // 抢断
    blocks: number;        // 盖帽
    turnovers: number;     // 失误
    fouls: number;         // 犯规
    fieldGoalsMade: number;   // 投篮命中
    fieldGoalsAttempted: number; // 投篮出手
    threePointersMade: number;  // 三分命中
    threePointersAttempted: number; // 三分出手
    freeThrowsMade: number;    // 罚球命中
    freeThrowsAttempted: number; // 罚球出手
  };
}

// 球员赛季统计
export interface PlayerStat {
  _id?: string;
  playerId: number;
  playerName: string;
  teamId: number;
  season: string;
  seasonYear: number;
  
  // 场均数据
  gamesPlayed: number;     // 出场次数
  gamesStarted: number;    // 首发次数
  minutesPerGame: number;  // 场均时间
  pointsPerGame: number;  // 场均得分
  reboundsPerGame: number; // 场均篮板
  assistsPerGame: number;  // 场均助攻
  stealsPerGame: number;   // 场均抢断
  blocksPerGame: number;   // 场均盖帽
  turnoversPerGame: number; // 场均失误
  
  // 投篮命中率
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  
  // 总数据
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// 球队赛季统计
export interface TeamStat {
  _id?: string;
  teamId: number;
  teamName: string;
  season: string;
  seasonYear: number;
  
  wins: number;            // 胜
  losses: number;          // 负
  winPercentage: number;   // 胜率
  conferenceRank: number; // 分区排名
  divisionRank: number;    // 赛区排名
  homeWins: number;        // 主场胜
  homeLosses: number;      // 主场负
  awayWins: number;       // 客场胜
  awayLosses: number;     // 客场负
  
  pointsPerGame: number;  // 场均得分
  pointsAgainstPerGame: number; // 场均失分
  reboundsPerGame: number;
  assistsPerGame: number;
  
  createdAt: Date;
  updatedAt: Date;
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

// 查询参数类型
export interface TeamQueryParams {
  page?: number;
  pageSize?: number;
  conference?: string;
  division?: string;
  keyword?: string;
}

export interface PlayerQueryParams {
  page?: number;
  pageSize?: number;
  teamId?: number;
  position?: string;
  keyword?: string;
}

export interface MatchQueryParams {
  page?: number;
  pageSize?: number;
  season?: string;
  teamId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: MatchStatus;
}