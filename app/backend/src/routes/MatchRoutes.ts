import { Router, Request, Response } from 'express';
import MatchService from '../services/MatchService';
import MatchController from '../controllers/MatchController';

const matchRoutes = Router();

const matchService = new MatchService();

const matchController = new MatchController(matchService);

matchRoutes.patch(
  '/:id',
  (req: Request, res: Response) => matchController.upMatchesInProgress(req, res),
);

matchRoutes.patch(
  '/:id/finish',
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

matchRoutes.get(
  '/',
  (req: Request, res: Response) => matchController.getAllMatches(req, res),
);

matchRoutes.post(
  '/',
  (req: Request, res: Response) => matchController.createMatches(req, res),
);

export default matchRoutes;
