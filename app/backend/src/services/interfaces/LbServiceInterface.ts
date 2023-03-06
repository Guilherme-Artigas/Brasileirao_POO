import IPerformance from '../../interfaces/IPerformance';

export default interface IlbService {
  initialPerformance(): Promise<IPerformance[]>;
}
