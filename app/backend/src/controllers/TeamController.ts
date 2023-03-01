import { Request, Response } from 'express';
import ITeamService from '../services/interfaces/TeamServiceInterface';

export default class TeamController {
  private _service: ITeamService;

  constructor(private service: ITeamService) {
    this._service = service;
  }

  async getAllTeams(req: Request, res: Response) {
    const result = await this._service.getAllTeams();
    return res.status(200).json(result);
  }

  async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._service.getTeamById(parseInt(id, 10));
    return res.status(200).json(result);
  }
}
