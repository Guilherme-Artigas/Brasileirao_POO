import 'dotenv';
import { Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import IUserService from '../services/interfaces/UserServiceInterface';
import TokenNotFound from '../middlewares/errors/TokenNotFound';
import IJwt from '../interfaces/JwtInterface';
import InvalidToken from '../middlewares/errors/InvalidToken';

export default class UserController {
  private _service: IUserService;
  private _userRole: string | JwtPayload | undefined;

  constructor(private service: IUserService) {
    this._service = service;
  }

  async userLogin(req: Request, res: Response) {
    const token = await this._service.loginUser(req.body);
    return res.status(200).json({ token });
  }

  handleToken(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization) throw new TokenNotFound('Token not found');
    try {
      const secret = process.env.JWT_SECRET as string;
      this._userRole = verify(authorization, secret);
      const { role } = this._userRole as IJwt;
      return res.status(200).json({ role });
    } catch (err) {
      throw new InvalidToken('Token must be a valid token');
    }
  }
}
