import { Request, Response } from 'express';
import IMatchService from '../services/MatchService';

export default class MatchController {
  private _service: IMatchService;

  constructor(private service: IMatchService) {
    this._service = service;
  }

  async getAllMatches(req: Request, res: Response) {
    const result = await this._service.getAllMatches();
    return res.status(200).json(result);
  }
}
