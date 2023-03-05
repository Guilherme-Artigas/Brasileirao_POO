import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv';
import IMatchService from '../services/MatchService';
import Unauthorized from '../middlewares/errors/Unauthorized';
import InvalidToken from '../middlewares/errors/InvalidToken';

const TOKEN_NOT_FOUND = 'Token not found';
const INVALID_TOKEN = 'Token must be a valid token';

const SECRET = process.env.JWT_SECRET as string;

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
    if (!authorization) throw new Unauthorized(TOKEN_NOT_FOUND);
    try {
      verify(authorization, SECRET);
      const result = await this._service.finishMatch(parseInt(id, 10));
      return res.status(200).json(result);
    } catch (err) {
      throw new InvalidToken(INVALID_TOKEN);
    }
  }

  async upMatchesInProgress(req: Request, res: Response) {
    const { params: { id }, headers: { authorization }, body } = req;
    if (!authorization) throw new Unauthorized(TOKEN_NOT_FOUND);
    try {
      verify(authorization, SECRET);
      const result = await this._service.upMatchesInProgress(parseInt(id, 10), body);
      return res.status(200).json(result);
    } catch (e) {
      throw new InvalidToken(INVALID_TOKEN);
    }
  }

  async createMatches(req: Request, res: Response) {
    const { headers: { authorization }, body } = req;
    if (!authorization) throw new Unauthorized(TOKEN_NOT_FOUND);
    try {
      verify(authorization, SECRET);
    } catch (e) {
      throw new InvalidToken(INVALID_TOKEN);
    }
    const result = await this._service.createMatches(body);
    return res.status(201).json(result);
  }
}
