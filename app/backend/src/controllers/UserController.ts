import { Request, Response } from 'express';
import IUserService from '../services/interfaces/UserServiceInterface';

export default class UserController {
  private _service: IUserService;

  constructor(private service: IUserService) {
    this._service = service;
  }

  async userLogin(req: Request, res: Response) {
    const token = await this._service.loginUser(req.body);
    return res.status(200).json({ token });
  }
}
