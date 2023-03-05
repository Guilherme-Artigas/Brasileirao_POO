import { ModelStatic } from 'sequelize';
import IlbService from './interfaces/LbServiceInterface';
import IPerformance from '../interfaces/IPerformance';

import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatch from '../interfaces/IMatch';
import ITeam from '../interfaces/TeamInterface';

export default class LeaderBoardService implements IlbService {
  protected lbModel: ModelStatic<MatchModel>;
  protected teamModel: ModelStatic<TeamModel>;

  constructor() {
    this.lbModel = MatchModel;
    this.teamModel = TeamModel;
  }

  async initialPerformance(): Promise<IPerformance[] | IMatch[] | ITeam[]> {
    const allTeams = await this.teamModel.findAll();
    const allPerformance = allTeams.map((team) => {
      const obj = {
        name: team.teamName,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
      };
      return obj;
    });
    return allPerformance;
  }
}
