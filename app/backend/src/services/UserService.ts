import { compareSync } from 'bcryptjs';
import { ModelStatic } from 'sequelize';
import generateToken from '../utils/Jwt';
import UserModel from '../database/models/UserModel';
import IUserService from './interfaces/UserServiceInterface';
import IUserLogin from '../interfaces/IUserLogin';
import IUser from '../interfaces/IUser';
import Unauthorized from '../middlewares/errors/Unauthorized';
import BadRequest from '../middlewares/errors/BadRequest';

export default class UserService implements IUserService {
  protected model: ModelStatic<UserModel>;
  private _emailRegex: RegExp;

  constructor() {
    this.model = UserModel;
    this._emailRegex = /\S+@\S+\.\S+/;
  }

  async loginUser(body: IUserLogin): Promise<string | void> {
    if (!body.email || !body.password) throw new BadRequest('All fields must be filled');
    const verifiedEmail = this._emailRegex.test(body.email);
    const userData = await this.model.findOne({ where: { email: body.email } }) as IUser;
    if (
      !verifiedEmail
      || !userData
      || body.password.length < 6
      || !compareSync(body.password, userData.password)
    ) {
      throw new Unauthorized('Invalid email or password');
    } else {
      return generateToken({ id: userData.id, role: userData.role });
    }
  }
}
