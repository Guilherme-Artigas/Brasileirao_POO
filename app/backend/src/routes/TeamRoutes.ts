import { Router, Request, Response } from 'express';
import TeamService from '../services/TeamService';
import TeamController from '../controllers/TeamController';

const teamRoutes = Router();

const teamService = new TeamService();

const teamController = new TeamController(teamService);

teamRoutes.get(
  '/',
  (req: Request, res: Response) => teamController.getAllTeams(req, res),
);

teamRoutes.get(
  '/:id',
  (req: Request, res: Response) => teamController.getTeamById(req, res),
);

export default teamRoutes;
