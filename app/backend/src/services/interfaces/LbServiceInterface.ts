import IPerformance from '../../interfaces/IPerformance';
import IMatch from '../../interfaces/IMatch';
import ITeam from '../../interfaces/TeamInterface';

export default interface IlbService {
  initialPerformance(): Promise<IPerformance[] | IMatch[] | ITeam[]>;
}
