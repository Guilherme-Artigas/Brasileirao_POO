import { Request, Response } from 'express';
import IUserService from '../services/interfaces/UserServiceInterface';

export default class UserController {
  private _service: IUserService;

  constructor(private service: IUserService) {
    this._service = service;
  }

  async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const result = await this._service.loginUser(email, password);
    return res.status(200).json({ token: result });
  }
}
