import IUserLogin from '../../interfaces/IUserLogin';

export default interface IUserService {
  loginUser(body: IUserLogin): Promise<string | void>;
}
