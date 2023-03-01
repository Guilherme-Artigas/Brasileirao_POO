export default interface IUserService {
  loginUser(email: string, password: string): Promise<string | boolean>;
}
