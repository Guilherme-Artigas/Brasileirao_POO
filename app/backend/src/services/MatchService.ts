import { ModelStatic } from 'sequelize';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';

import IMatchService from './interfaces/IMatchService';
import IMatch from '../interfaces/IMatch';
import IUpdateMatchesProgress from '../interfaces/IUpdateMatchesProgress';

export default class MatchService implements IMatchService {
  protected model: ModelStatic<MatchModel>;

  constructor() {
    this.model = MatchModel;
  }

  async getAllMatches(): Promise<IMatch[]> {
    const result = await this.model.findAll(
      {
        include: [
          { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
      },
    );
    return result;
  }

  async checkAllMatches(progress: string): Promise<IMatch[]> {
    const result = await this.model.findAll(
      {
        include: [
          { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
        where: { inProgress: progress.includes('true') },
      },
    );
    return result;
  }

  async finishMatch(id: number): Promise<string> {
    await this.model.update(
      { inProgress: false },
      { where: { id } },
    );
    return 'Finished';
  }

  async updateMatchesInProgress(
    id: number,
    body: IUpdateMatchesProgress,
  ): Promise<IUpdateMatchesProgress> {
    await this.model.update(
      { homeTeamGoals: body.homeTeamGoals, awayTeamGoals: body.awayTeamGoals },
      { where: { id } },
    );
    return { ...body };
  }
}
