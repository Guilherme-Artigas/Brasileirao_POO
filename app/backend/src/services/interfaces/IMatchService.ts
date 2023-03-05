import IMatch from '../../interfaces/IMatch';
import IUpdateMatchesProgress from '../../interfaces/IUpdateMatchesProgress';

export default interface IMatchService {
  getAllMatches(): Promise<IMatch[]>;
  checkAllMatches(inProgress: string): Promise<IMatch[]>;
  finishMatch(id: number): Promise<string>;

  updateMatchesInProgress(
    id: number,
    body: IUpdateMatchesProgress
  ): Promise<IUpdateMatchesProgress>;
}
