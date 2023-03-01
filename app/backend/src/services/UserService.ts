import { compareSync } from 'bcryptjs';
import { ModelStatic } from 'sequelize';
import generateToken from '../utils/Jwt';
import UserModel from '../database/models/UserModel';
import IUserService from './interfaces/UserServiceInterface';

export default class UserService implements IUserService {
  protected model: ModelStatic<UserModel>;

  constructor() {
    this.model = UserModel;
  }

  async loginUser(email: string, password: string): Promise<string | boolean> {
    const result = await this.model.findOne({ where: { email } });
    if (!result) return 'User not found';
    if (compareSync(password, result.password)) {
      const payload = {
        id: result.id,
        role: result.role,
      };
      return generateToken(payload);
    }
    return false;
  }
}
