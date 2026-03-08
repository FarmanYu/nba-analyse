import { Request, Response } from 'express';
import { TeamModel } from '../models';
import { TeamQueryParams, ApiResponse, ITeam } from '../types';
import CacheService from '../services/cache';
import config from '../config';

export class TeamController {
  /**
   * 获取球队列表
   */
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 20, conference, division, keyword } = req.query as TeamQueryParams;
      
      const query: any = {};
      if (conference) query.conference = conference;
      if (division) query.division = division;
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { shortName: { $regex: keyword, $options: 'i' } }
        ];
      }
      
      const [teams, total] = await Promise.all([
        TeamModel.find(query)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .sort({ teamId: 1 }),
        TeamModel.countDocuments(query)
      ]);
      
      const response: ApiResponse<ITeam[]> = {
        code: 0,
        message: 'success',
        data: teams,
        pagination: { page, pageSize, total }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error getting teams:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取球队详情
   */
  async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cacheKey = `team:${id}`;
      
      // 尝试从缓存获取
      const cached = await CacheService.get<ITeam>(cacheKey);
      if (cached) {
        res.json({ code: 0, message: 'success', data: cached });
        return;
      }
      
      const team = await TeamModel.findOne({ teamId: Number(id) });
      
      if (!team) {
        res.status(404).json({ code: 404, message: '球队不存在' });
        return;
      }
      
      // 缓存结果
      await CacheService.set(cacheKey, team, config.cache.team);
      
      res.json({ code: 0, message: 'success', data: team });
    } catch (error) {
      console.error('Error getting team:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取球队排名
   */
  async getTeamRankings(req: Request, res: Response): Promise<void> {
    try {
      const { conference } = req.query;
      const query = conference ? { conference } : {};
      
      // 这里应该从 TeamStat 获取实际排名，目前简化处理
      const teams = await TeamModel.find(query).sort({ teamId: 1 });
      
      res.json({
        code: 0,
        message: 'success',
        data: teams.map((team, index) => ({
          ...team.toObject(),
          rank: index + 1,
          wins: Math.floor(Math.random() * 50),
          losses: Math.floor(Math.random() * 50),
          winPercentage: 0.5 + (Math.random() - 0.5) * 0.4
        }))
      });
    } catch (error) {
      console.error('Error getting team rankings:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取分区球队
   */
  async getTeamsByDivision(req: Request, res: Response): Promise<void> {
    try {
      const { conference, division } = req.query;
      const query: any = {};
      
      if (conference) query.conference = conference;
      if (division) query.division = division;
      
      const teams = await TeamModel.find(query).sort({ teamId: 1 });
      
      // 按分区分组
      const grouped = teams.reduce((acc, team) => {
        const div = team.division || 'other';
        if (!acc[div]) acc[div] = [];
        acc[div].push(team);
        return acc;
      }, {} as Record<string, ITeam[]>);
      
      res.json({ code: 0, message: 'success', data: grouped });
    } catch (error) {
      console.error('Error getting teams by division:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
}

export const teamController = new TeamController();