import IMatch from '../../interfaces/IMatch';
import IUpMatchesProgress from '../../interfaces/IUpdateMatchesProgress';
import ICreateMatches from '../../interfaces/ICreateMatches';
import IResponseCreateMatches from '../../interfaces/IResponseCreateMatches';

export default interface IMatchService {
  getAllMatches(): Promise<IMatch[]>;
  checkAllMatches(inProgress: string): Promise<IMatch[]>;
  finishMatch(id: number): Promise<string>;

  upMatchesInProgress(id: number, body: IUpMatchesProgress): Promise<IUpMatchesProgress>;

  createMatches(body: ICreateMatches): Promise<IResponseCreateMatches>;
}
