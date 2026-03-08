# 🏀 NBA 篮球比赛分析系统

> 基于 Web 的 NBA 篮球比赛数据分析平台，提供球队、球员、比赛数据的查询、统计和可视化分析。

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E=14.0.0-green)
![Vue](https://img.shields.io/badge/Vue-3.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)

## ✨ 特性

- 🏀 **球队管理** - 球队列表、详情、战绩排名
- 👤 **球员管理** - 球员列表、数据统计、对比分析
- 📅 **比赛分析** - 赛程、结果、技术统计
- 📊 **数据可视化** - 图表展示、趋势分析
- 🔄 **数据同步** - 自动抓取 NBA 数据
- 📱 **响应式设计** - 支持移动端访问

## 🛠 技术栈

### 后端
- **Express 4.x** - Web 框架
- **TypeScript** - 类型安全
- **MongoDB + Mongoose 8** - 数据库
- **Redis** - 缓存 (可选)
- **Winston** - 日志管理
- **ECharts** - 数据可视化

### 前端
- **Vue 3** - 渐进式框架
- **TypeScript** - 类型支持
- **Vite** - 构建工具
- **Pinia** - 状态管理
- **Element Plus** - UI 组件库

## 🚀 快速开始

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client && npm install && cd ..
```

### 启动开发服务器

```bash
# 启动后端 (默认端口 3000)
npm run dev:server

# 启动前端 (默认端口 5173)
npm run dev:client
```

### 生产环境构建

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 环境变量

创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nba
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=*
```

## 📁 项目结构

```
nba-analyse/
├── src/                      # 后端源码
│   ├── config/              # 配置文件
│   ├── controllers/         # 控制器
│   ├── middleware/          # 中间件
│   ├── models/              # 数据模型
│   ├── routes/             # 路由
│   ├── services/            # 业务服务
│   ├── types/              # TypeScript 类型
│   └── index.ts            # 入口文件
├── client/                  # 前端源码
│   ├── src/
│   │   ├── api/            # API 客户端
│   │   ├── components/     # 组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   └── views/         # 页面视图
│   └── package.json
└── package.json
```

## 📡 API 接口

### 球队

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/teams` | 获取球队列表 |
| GET | `/api/teams/:id` | 获取球队详情 |
| GET | `/api/teams/rankings` | 获取球队排名 |
| GET | `/api/teams/division` | 获取分区球队 |

### 球员

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/players` | 获取球员列表 |
| GET | `/api/players/:id` | 获取球员详情 |
| GET | `/api/players/team/:teamId` | 获取球队球员 |
| GET | `/api/players/search` | 搜索球员 |

### 比赛

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/matches` | 获取比赛列表 |
| GET | `/api/matches/:id` | 获取比赛详情 |
| GET | `/api/matches/upcoming` | 即将开始的比赛 |
| GET | `/api/matches/schedule` | 赛季赛程 |

### 数据同步

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/admin/sync/teams` | 同步球队数据 |
| POST | `/api/admin/sync/players` | 同步球员数据 |
| POST | `/api/admin/sync/matches` | 同步比赛数据 |
| POST | `/api/admin/sync/all` | 同步所有数据 |

## 📝 Changelog

### v2.0.0 (2024-01)
- ✨ 全新架构重构
- 🎨 前后端分离
- 📱 响应式设计
- 🗄️ MongoDB 数据存储
- 📊 ECharts 数据可视化
- 🔄 RESTful API
- ⭐ 完整的 CRUD 功能

### v1.0.0 (早期版本)
- 基础 Express + Angular 1.x 版本
- jQuery + Angular 混合使用
- 简陋的 UI 界面

## 📄 许可证

MIT License - 请查看 [LICENSE](LICENSE) 文件

## 👤 作者

- GitHub: [@farmanyu](https://github.com/farmanyu)
- Email: yuhongfei1001@163.com

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [ECharts](https://echarts.apache.org/)
- [MongoDB](https://www.mongodb.com/)