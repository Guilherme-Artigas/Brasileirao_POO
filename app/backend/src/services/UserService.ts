import { ModelStatic } from 'sequelize';
import UserModel from '../database/models/UserModel';
import IUserService from './interfaces/UserServiceInterface';

export default class UserService implements IUserService {
  protected model: ModelStatic<UserModel>;

  constructor() {
    this.model = UserModel;
  }

  async loginUser(email: string): Promise<string> {
    const result = await this.model.findOne({ where: { email } });
    if (!result) return 'Email não encontrado no banco';
    return result.email;
  }
}
