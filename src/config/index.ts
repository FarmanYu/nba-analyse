import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nba',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  nba: {
    // NBA数据源配置
    apiBaseUrl: process.env.NBA_API_URL || 'https://data.nba.net',
    // 数据同步配置
    syncInterval: 1000 * 60 * 60, // 1小时
    maxRetries: 3,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 100次请求
  },
  
  cache: {
    // 缓存时间（秒）
    team: 3600,      // 球队数据缓存1小时
    player: 1800,     // 球员数据缓存30分钟
    match: 300,       // 比赛数据缓存5分钟
    stat: 7200,       // 统计数据缓存2小时
  }
};