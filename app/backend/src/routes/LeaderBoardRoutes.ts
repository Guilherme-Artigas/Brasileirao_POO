import { Router, Request, Response } from 'express';
import LeaderBoardController from '../controllers/LeaderBoardController';
import LeaderBoardService from '../services/LeaderBoardService';

const leaderBoardRoutes = Router();

const leaderBoardService = new LeaderBoardService();

const leaderBoardController = new LeaderBoardController(leaderBoardService);

leaderBoardRoutes.get(
  '/home',
  (req: Request, res: Response) => leaderBoardController.initialPerformance(req, res),
);

export default leaderBoardRoutes;
