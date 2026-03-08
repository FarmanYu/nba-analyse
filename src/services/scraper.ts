import axios from 'axios';
import * as cheerio from 'cheerio';
import { TeamModel, PlayerModel, MatchModel } from '../models';
import { Team, Player, Match } from '../types';
import config from '../config';

class NBAScraperService {
  private baseUrl = config.nba.apiBaseUrl;
  
  /**
   * 抓取球队列表
   */
  async fetchTeams(): Promise<Partial<Team>[]> {
    try {
      // 这里可以使用 NBA 官方 API 或者网页抓取
      // 示例：使用静态数据（实际开发中应该从 API 获取）
      const teams: Partial<Team>[] = [
        { teamId: 1, name: '亚特兰大老鹰', shortName: '老鹰', city: '亚特兰大', conference: '东部', division: '东南区' },
        { teamId: 2, name: '波士顿凯尔特人', shortName: '凯尔特人', city: '波士顿', conference: '东部', division: '大西洋区' },
        { teamId: 3, name: '布鲁克林篮网', shortName: '篮网', city: '布鲁克林', conference: '东部', division: '大西洋区' },
        { teamId: 4, name: '夏洛特黄蜂', shortName: '黄蜂', city: '夏洛特', conference: '东部', division: '东南区' },
        { teamId: 5, name: '芝加哥公牛', shortName: '公牛', city: '芝加哥', conference: '东部', division: '中部区' },
        { teamId: 6, name: '克利夫兰骑士', shortName: '骑士', city: '克利夫兰', conference: '东部', division: '中部区' },
        { teamId: 7, name: '达拉斯独行侠', shortName: '独行侠', city: '达拉斯', conference: '西部', division: '西南区' },
        { teamId: 8, name: '丹佛掘金', shortName: '掘金', city: '丹佛', conference: '西部', division: '西北区' },
        { teamId: 9, name: '底特律活塞', shortName: '活塞', city: '底特律', conference: '东部', division: '中部区' },
        { teamId: 10, name: '金州勇士', shortName: '勇士', city: '金州', conference: '西部', division: '太平洋区' },
        { teamId: 11, name: '休斯顿火箭', shortName: '火箭', city: '休斯顿', conference: '西部', division: '西南区' },
        { teamId: 12, name: '印第安纳步行者', shortName: '步行者', city: '印第安纳', conference: '东部', division: '中部区' },
        { teamId: 13, name: '洛杉矶快船', shortName: '快船', city: '洛杉矶', conference: '西部', division: '太平洋区' },
        { teamId: 14, name: '洛杉矶湖人', shortName: '湖人', city: '洛杉矶', conference: '西部', division: '太平洋区' },
        { teamId: 15, name: '孟菲斯灰熊', shortName: '灰熊', city: '孟菲斯', conference: '西部', division: '西南区' },
        { teamId: 16, name: '迈阿密热火', shortName: '热火', city: '迈阿密', conference: '东部', division: '东南区' },
        { teamId: 17, name: '密尔沃基雄鹿', shortName: '雄鹿', city: '密尔沃基', conference: '东部', division: '中部区' },
        { teamId: 18, name: '明尼苏达森林狼', shortName: '森林狼', city: '明尼苏达', conference: '西部', division: '西北区' },
        { teamId: 19, name: '新奥尔良鹈鹕', shortName: '鹈鹕', city: '新奥尔良', conference: '西部', division: '西南区' },
        { teamId: 20, name: '纽约尼克斯', shortName: '尼克斯', city: '纽约', conference: '东部', division: '大西洋区' },
        { teamId: 21, name: '俄克拉荷马雷霆', shortName: '雷霆', city: '俄克拉荷马', conference: '西部', division: '西北区' },
        { teamId: 22, name: '奥兰多魔术', shortName: '魔术', city: '奥兰多', conference: '东部', division: '东南区' },
        { teamId: 23, name: '费城76人', shortName: '76人', city: '费城', conference: '东部', division: '大西洋区' },
        { teamId: 24, name: '菲尼克斯太阳', shortName: '太阳', city: '菲尼克斯', conference: '西部', division: '太平洋区' },
        { teamId: 25, name: '波特兰开拓者', shortName: '开拓者', city: '波特兰', conference: '西部', division: '西北区' },
        { teamId: 26, name: '萨克拉门托国王', shortName: '国王', city: '萨克拉门托', conference: '西部', division: '太平洋区' },
        { teamId: 27, name: '圣安东尼奥马刺', shortName: '马刺', city: '圣安东尼奥', conference: '西部', division: '西南区' },
        { teamId: 28, name: '多伦多猛龙', shortName: '猛龙', city: '多伦多', conference: '东部', division: '大西洋区' },
        { teamId: 29, name: '犹他爵士', shortName: '爵士', city: '犹他', conference: '西部', division: '西北区' },
        { teamId: 30, name: '华盛顿奇才', shortName: '奇才', city: '华盛顿', conference: '东部', division: '东南区' },
      ];
      return teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }
  
  /**
   * 同步球队数据
   */
  async syncTeams(): Promise<number> {
    const teams = await this.fetchTeams();
    let synced = 0;
    
    for (const team of teams) {
      await TeamModel.findOneAndUpdate(
        { teamId: team.teamId },
        team,
        { upsert: true, new: true }
      );
      synced++;
    }
    
    console.log(`✅ Synced ${synced} teams`);
    return synced;
  }
  
  /**
   * 抓取球员列表
   */
  async fetchPlayers(teamId?: number): Promise<Partial<Player>[]> {
    // 示例球员数据
    const players: Partial<Player>[] = [
      { playerId: 1, name: '勒布朗·詹姆斯', englishName: 'LeBron James', teamId: 30, position: 'SF', number: '23', height: '2.06m', weight: '113kg', country: '美国' },
      { playerId: 2, name: '斯蒂芬·库里', englishName: 'Stephen Curry', teamId: 10, position: 'PG', number: '30', height: '1.88m', weight: '84kg', country: '美国' },
      { playerId: 3, name: '凯文·杜兰特', englishName: 'Kevin Durant', teamId: 13, position: 'SF', number: '35', height: '2.08m', weight: '109kg', country: '美国' },
      { playerId: 4, name: '扬尼斯·阿德托昆博', englishName: 'Giannis Antetokounmpo', teamId: 17, position: 'PF', number: '34', height: '2.11m', weight: '110kg', country: '希腊' },
      { playerId: 5, name: '尼古拉·约基奇', englishName: 'Nikola Jokic', teamId: 8, position: 'C', number: '15', height: '2.08m', weight: '129kg', country: '塞尔维亚' },
    ];
    
    if (teamId) {
      return players.filter(p => p.teamId === teamId);
    }
    return players;
  }
  
  /**
   * 同步球员数据
   */
  async syncPlayers(): Promise<number> {
    const teams = await TeamModel.find();
    let synced = 0;
    
    for (const team of teams) {
      const players = await this.fetchPlayers(team.teamId);
      for (const player of players) {
        await PlayerModel.findOneAndUpdate(
          { playerId: player.playerId },
          player,
          { upsert: true, new: true }
        );
        synced++;
      }
    }
    
    console.log(`✅ Synced ${synced} players`);
    return synced;
  }
  
  /**
   * 生成模拟比赛数据
   */
  async generateMatchData(seasonYear: number = 2024): Promise<Partial<Match>[]> {
    const teams = await TeamModel.find();
    const matches: Partial<Match>[] = [];
    const months = [10, 11, 12, 1, 2, 3, 4, 5, 6]; // NBA赛季月份
    
    // 每支球队随机生成一些比赛
    for (let i = 0; i < 50; i++) {
      const hostTeam = teams[Math.floor(Math.random() * teams.length)];
      let guestTeam = teams[Math.floor(Math.random() * teams.length)];
      while (guestTeam.teamId === hostTeam.teamId) {
        guestTeam = teams[Math.floor(Math.random() * teams.length)];
      }
      
      const month = months[Math.floor(Math.random() * months.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const gameDate = new Date(seasonYear, month, day);
      
      const hostScore = Math.floor(Math.random() * 40) + 80;
      const guestScore = Math.floor(Math.random() * 40) + 80;
      
      matches.push({
        matchId: Date.now() + i,
        season: `${seasonYear}-${seasonYear + 1}`,
        seasonYear,
        gameDate,
        timestamp: gameDate.getTime(),
        hostTeamId: hostTeam.teamId,
        hostTeamName: hostTeam.name,
        hostScore,
        hostQuarterScore: this.generateQuarterScore(hostScore),
        guestTeamId: guestTeam.teamId,
        guestTeamName: guestTeam.name,
        guestScore,
        guestQuarterScore: this.generateQuarterScore(guestScore),
        status: 'finished',
        type: 2,
      });
    }
    
    return matches;
  }
  
  private generateQuarterScore(total: number): number[] {
    const quarters = [];
    let remaining = total;
    for (let i = 0; i < 4; i++) {
      const score = i < 3 
        ? Math.floor(remaining / (4 - i) * (0.8 + Math.random() * 0.4))
        : remaining;
      quarters.push(score);
      remaining -= score;
    }
    return quarters;
  }
  
  /**
   * 同步比赛数据
   */
  async syncMatches(seasonYear: number = 2024): Promise<number> {
    const matches = await this.generateMatchData(seasonYear);
    let synced = 0;
    
    for (const match of matches) {
      await MatchModel.findOneAndUpdate(
        { matchId: match.matchId },
        match,
        { upsert: true, new: true }
      );
      synced++;
    }
    
    console.log(`✅ Synced ${synced} matches`);
    return synced;
  }
  
  /**
   * 完整同步所有数据
   */
  async syncAll(): Promise<{ teams: number; players: number; matches: number }> {
    const teams = await this.syncTeams();
    const players = await this.syncPlayers();
    const matches = await this.syncMatches();
    
    return { teams, players, matches };
  }
}

export const nbaScraperService = new NBAScraperService();
export default nbaScraperService;