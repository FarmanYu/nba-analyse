import { Request, Response } from 'express';
import { MatchModel, TeamModel } from '../models';
import { MatchQueryParams, ApiResponse, IMatch } from '../types';
import CacheService from '../services/cache';
import config from '../config';

export class MatchController {
  /**
   * 获取比赛列表
   */
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 20, season, teamId, startDate, endDate, status } = req.query as MatchQueryParams;
      
      const query: any = {};
      if (season) query.season = season;
      if (status) query.status = status;
      if (teamId) {
        query.$or = [
          { hostTeamId: Number(teamId) },
          { guestTeamId: Number(teamId) }
        ];
      }
      if (startDate || endDate) {
        query.gameDate = {};
        if (startDate) query.gameDate.$gte = new Date(startDate);
        if (endDate) query.gameDate.$lte = new Date(endDate);
      }
      
      const [matches, total] = await Promise.all([
        MatchModel.find(query)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .sort({ gameDate: -1 }),
        MatchModel.countDocuments(query)
      ]);
      
      res.json({
        code: 0,
        message: 'success',
        data: matches,
        pagination: { page, pageSize, total }
      });
    } catch (error) {
      console.error('Error getting matches:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取比赛详情
   */
  async getMatchById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cacheKey = `match:${id}`;
      
      const cached = await CacheService.get<IMatch>(cacheKey);
      if (cached) {
        res.json({ code: 0, message: 'success', data: cached });
        return;
      }
      
      const match = await MatchModel.findOne({ matchId: Number(id) });
      
      if (!match) {
        res.status(404).json({ code: 404, message: '比赛不存在' });
        return;
      }
      
      await CacheService.set(cacheKey, match, config.cache.match);
      
      res.json({ code: 0, message: 'success', data: match });
    } catch (error) {
      console.error('Error getting match:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取球队最近比赛
   */
  async getTeamMatches(req: Request, res: Response): Promise<void> {
    try {
      const { teamId, count = 10 } = req.params;
      
      const matches = await MatchModel.find({
        $or: [
          { hostTeamId: Number(teamId) },
          { guestTeamId: Number(teamId) }
        ],
        status: 'finished'
      })
        .sort({ gameDate: -1 })
        .limit(Number(count));
      
      res.json({ code: 0, message: 'success', data: matches });
    } catch (error) {
      console.error('Error getting team matches:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取即将开始的比赛
   */
  async getUpcomingMatches(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(date as string) : new Date();
      targetDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const matches = await MatchModel.find({
        gameDate: { $gte: targetDate, $lt: nextDate },
        status: 'scheduled'
      }).sort({ gameDate: 1 });
      
      res.json({ code: 0, message: 'success', data: matches });
    } catch (error) {
      console.error('Error getting upcoming matches:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取赛季赛程
   */
  async getSeasonSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { seasonYear, teamId } = req.query;
      
      const query: any = { seasonYear: Number(seasonYear) || new Date().getFullYear() };
      if (teamId) {
        query.$or = [
          { hostTeamId: Number(teamId) },
          { guestTeamId: Number(teamId) }
        ];
      }
      
      const matches = await MatchModel.find(query)
        .sort({ gameDate: 1 });
      
      // 按月份分组
      const schedule = matches.reduce((acc, match) => {
        const month = match.gameDate.getMonth();
        if (!acc[month]) acc[month] = [];
        acc[month].push(match);
        return acc;
      }, {} as Record<string, IMatch[]>);
      
      res.json({ code: 0, message: 'success', data: schedule });
    } catch (error) {
      console.error('Error getting season schedule:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取比赛数据统计
   */
  async getMatchStats(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.query;
      
      const query = teamId ? {
        $or: [
          { hostTeamId: Number(teamId) },
          { guestTeamId: Number(teamId) }
        ]
      } : {};
      
      const stats = await MatchModel.aggregate([
        { $match: { ...query, status: 'finished' } },
        {
          $group: {
            _id: null,
            totalGames: { $sum: 1 },
            avgScore: { $avg: { $add: ['$hostScore', '$guestScore'] } },
            homeWins: {
              $sum: { $cond: [{ $gt: ['$hostScore', '$guestScore'] }, 1, 0] }
            },
            awayWins: {
              $sum: { $cond: [{ $gt: ['$guestScore', '$hostScore'] }, 1, 0] }
            }
          }
        }
      ]);
      
      res.json({ code: 0, message: 'success', data: stats[0] || {} });
    } catch (error) {
      console.error('Error getting match stats:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
}

export const matchController = new MatchController();