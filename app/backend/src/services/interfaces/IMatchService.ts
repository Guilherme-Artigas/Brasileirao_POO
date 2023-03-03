import IMatch from '../../interfaces/IMatch';

export default interface IMatchService {
  getAllMatches(): Promise<IMatch[]>;
  checkAllMatches(inProgress: string): Promise<IMatch[]>;
}
