import { Request, Response } from 'express';
import IlbService from '../services/interfaces/LbServiceInterface';

export default class LeaderBoardController {
  private _service: IlbService;

  constructor(private service: IlbService) {
    this._service = service;
  }

  async initialPerformance(_req: Request, res: Response) {
    const result = await this._service.initialPerformance();
    return res.status(200).json(result);
  }
}
