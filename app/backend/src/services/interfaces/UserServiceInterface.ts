export default interface IUserService {
  loginUser(email: string): Promise<string>;
}
