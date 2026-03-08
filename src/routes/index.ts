import { Router } from 'express';
import { teamController, playerController, matchController } from '../controllers';

const router = Router();

// ===== 球队路由 =====
router.get('/teams', teamController.getTeams);
router.get('/teams/rankings', teamController.getTeamRankings);
router.get('/teams/division', teamController.getTeamsByDivision);
router.get('/teams/:id', teamController.getTeamById);

// ===== 球员路由 =====
router.get('/players', playerController.getPlayers);
router.get('/players/search', playerController.searchPlayers);
router.get('/players/compare', playerController.comparePlayers);
router.get('/players/team/:teamId', playerController.getPlayersByTeam);
router.get('/players/:id', playerController.getPlayerById);

// ===== 比赛路由 =====
router.get('/matches', matchController.getMatches);
router.get('/matches/upcoming', matchController.getUpcomingMatches);
router.get('/matches/schedule', matchController.getSeasonSchedule);
router.get('/matches/stats', matchController.getMatchStats);
router.get('/matches/team/:teamId', matchController.getTeamMatches);
router.get('/matches/:id', matchController.getMatchById);

// ===== 数据同步路由 (管理员) =====
router.post('/admin/sync/teams', async (req, res) => {
  try {
    const { nbaScraperService } = await import('../services/scraper');
    const result = await nbaScraperService.syncTeams();
    res.json({ code: 0, message: 'success', data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '同步失败' });
  }
});

router.post('/admin/sync/players', async (req, res) => {
  try {
    const { nbaScraperService } = await import('../services/scraper');
    const result = await nbaScraperService.syncPlayers();
    res.json({ code: 0, message: 'success', data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '同步失败' });
  }
});

router.post('/admin/sync/matches', async (req, res) => {
  try {
    const { nbaScraperService } = await import('../services/scraper');
    const { seasonYear } = req.body;
    const result = await nbaScraperService.syncMatches(seasonYear);
    res.json({ code: 0, message: 'success', data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '同步失败' });
  }
});

router.post('/admin/sync/all', async (req, res) => {
  try {
    const { nbaScraperService } = await import('../services/scraper');
    const result = await nbaScraperService.syncAll();
    res.json({ code: 0, message: 'success', data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '同步失败' });
  }
});

export default router;