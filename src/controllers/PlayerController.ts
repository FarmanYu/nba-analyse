import { Request, Response } from 'express';
import { PlayerModel } from '../models';
import { PlayerQueryParams, ApiResponse, IPlayer } from '../types';
import CacheService from '../services/cache';
import config from '../config';

export class PlayerController {
  /**
   * 获取球员列表
   */
  async getPlayers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 20, teamId, position, keyword } = req.query as PlayerQueryParams;
      
      const query: any = {};
      if (teamId) query.teamId = Number(teamId);
      if (position) query.position = position;
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { englishName: { $regex: keyword, $options: 'i' } }
        ];
      }
      
      const [players, total] = await Promise.all([
        PlayerModel.find(query)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .sort({ playerId: 1 }),
        PlayerModel.countDocuments(query)
      ]);
      
      res.json({
        code: 0,
        message: 'success',
        data: players,
        pagination: { page, pageSize, total }
      });
    } catch (error) {
      console.error('Error getting players:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取球员详情
   */
  async getPlayerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cacheKey = `player:${id}`;
      
      const cached = await CacheService.get<IPlayer>(cacheKey);
      if (cached) {
        res.json({ code: 0, message: 'success', data: cached });
        return;
      }
      
      const player = await PlayerModel.findOne({ playerId: Number(id) });
      
      if (!player) {
        res.status(404).json({ code: 404, message: '球员不存在' });
        return;
      }
      
      await CacheService.set(cacheKey, player, config.cache.player);
      
      res.json({ code: 0, message: 'success', data: player });
    } catch (error) {
      console.error('Error getting player:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 获取球队球员列表
   */
  async getPlayersByTeam(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      
      const players = await PlayerModel.find({ teamId: Number(teamId) })
        .sort({ number: 1 });
      
      res.json({ code: 0, message: 'success', data: players });
    } catch (error) {
      console.error('Error getting players by team:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 球员数据对比
   */
  async comparePlayers(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.query;
      const playerIds = (ids as string).split(',').map(Number);
      
      const players = await PlayerModel.find({ 
        playerId: { $in: playerIds } 
      });
      
      if (players.length === 0) {
        res.status(404).json({ code: 404, message: '未找到球员' });
        return;
      }
      
      res.json({ code: 0, message: 'success', data: players });
    } catch (error) {
      console.error('Error comparing players:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
  
  /**
   * 球员搜索（自动补全）
   */
  async searchPlayers(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit = 10 } = req.query;
      
      if (!q) {
        res.json({ code: 0, message: 'success', data: [] });
        return;
      }
      
      const players = await PlayerModel.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { englishName: { $regex: q, $options: 'i' } }
        ]
      }).limit(Number(limit));
      
      res.json({ code: 0, message: 'success', data: players });
    } catch (error) {
      console.error('Error searching players:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
}

export const playerController = new PlayerController();