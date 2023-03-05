import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv';
import IMatchService from '../services/MatchService';
import Unauthorized from '../middlewares/errors/Unauthorized';
import InvalidToken from '../middlewares/errors/InvalidToken';

export default class MatchController {
  private _service: IMatchService;

  constructor(private service: IMatchService) {
    this._service = service;
  }

  async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    let result;
    if (!inProgress) {
      result = await this._service.getAllMatches();
      return res.status(200).json(result);
    }
    result = await this._service.checkAllMatches(inProgress as string);
    return res.status(200).json(result);
  }

  async finishMatch(req: Request, res: Response) {
    const { params: { id }, headers: { authorization } } = req;
    if (!authorization) throw new Unauthorized('Token not found');
    try {
      const SECRET = process.env.JWT_SECRET as string;
      verify(authorization, SECRET);
      const result = await this._service.finishMatch(parseInt(id, 10));
      return res.status(200).json(result);
    } catch (err) {
      throw new InvalidToken('Token must be a valid token');
    }
  }

  async updateMatchesInProgress(req: Request, res: Response) {
    const { params: { id }, headers: { authorization }, body } = req;
    if (!authorization) throw new Unauthorized('Token not found');
    try {
      const SECRET = process.env.JWT_SECRET as string;
      verify(authorization, SECRET);
      const result = await this._service.updateMatchesInProgress(parseInt(id, 10), body);
      return res.status(200).json(result);
    } catch (e) {
      throw new InvalidToken('Token must be a valid token');
    }
  }
}
