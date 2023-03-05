import ICreateMatches from './ICreateMatches';

export default interface IResponseCreateMatches extends ICreateMatches {
  id: number;
  inProgress: boolean;
}
