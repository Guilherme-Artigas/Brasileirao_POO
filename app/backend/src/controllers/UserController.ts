import { Request, Response } from 'express';
import IUserService from '../services/interfaces/UserServiceInterface';

export default class UserController {
  private _service: IUserService;

  constructor(private service: IUserService) {
    this._service = service;
  }

  async userLogin(req: Request, res: Response) {
    const { email } = req.body;
    const result = await this._service.loginUser(email);
    return res.status(201).json(result);
  }
}
