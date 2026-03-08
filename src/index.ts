import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import config from './config';
import routes from './routes';
import { requestLogger, errorLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/error';
import CacheService from './services/cache';

const app: Express = express();

// ===== 中间件配置 =====

// 安全头
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// 压缩
app.use(compression());

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use(requestLogger);

// ===== 路由 =====
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 数据初始化接口
app.post('/api/init', async (req, res) => {
  try {
    const { nbaScraperService } = await import('./services/scraper');
    const result = await nbaScraperService.syncAll();
    res.json({ code: 0, message: '初始化成功', data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '初始化失败' });
  }
});

// ===== 错误处理 =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== 数据库连接 =====
async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// ===== Redis 连接 =====
async function connectRedis(): Promise<void> {
  try {
    await CacheService.getRedis();
  } catch (error) {
    console.error('Redis connection error:', error);
  }
}

// ===== 启动服务器 =====
async function startServer(): Promise<void> {
  await connectDatabase();
  await connectRedis();
  
  app.listen(config.port, () => {
    console.log('='.repeat(50));
    console.log('🏀 NBA 分析系统已启动');
    console.log(`📍 访问地址: http://localhost:${config.port}`);
    console.log(`🔧 环境: ${config.nodeEnv}`);
    console.log('='.repeat(50));
  });
}

// 优雅退出
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// 导出用于测试
export { app };

// 启动服务
if (require.main === module) {
  startServer();
}