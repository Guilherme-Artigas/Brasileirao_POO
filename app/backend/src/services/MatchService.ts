import { ModelStatic } from 'sequelize';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';

import IMatchService from './interfaces/IMatchService';
import IMatch from '../interfaces/IMatch';
import IUpMatchesProgress from '../interfaces/IUpdateMatchesProgress';
import ICreateMatches from '../interfaces/ICreateMatches';
import IResponseCreateMatches from '../interfaces/IResponseCreateMatches';
import EqualOpponents from '../middlewares/errors/EqualOpponents';
import TeamNotFound from '../middlewares/errors/TeamNotFound';

export default class MatchService implements IMatchService {
  protected matchModel: ModelStatic<MatchModel>;
  protected teamModel: ModelStatic<TeamModel>;

  constructor() {
    this.matchModel = MatchModel;
    this.teamModel = TeamModel;
  }

  async getAllMatches(): Promise<IMatch[]> {
    const result = await this.matchModel.findAll(
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
    const result = await this.matchModel.findAll(
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
    await this.matchModel.update(
      { inProgress: false },
      { where: { id } },
    );
    return 'Finished';
  }

  async upMatchesInProgress(id: number, body: IUpMatchesProgress): Promise<IUpMatchesProgress> {
    await this.matchModel.update(
      { homeTeamGoals: body.homeTeamGoals, awayTeamGoals: body.awayTeamGoals },
      { where: { id } },
    );
    return { ...body };
  }

  async createMatches(body: ICreateMatches): Promise<IResponseCreateMatches> {
    if (body.homeTeamId === body.awayTeamId) {
      throw new EqualOpponents('It is not possible to create a match with two equal teams');
    }
    const homeTeamFound = await this.teamModel.findByPk(body.homeTeamId);
    const awayTeamFound = await this.teamModel.findByPk(body.awayTeamId);
    if (!homeTeamFound || !awayTeamFound) throw new TeamNotFound('There is no team with such id!');
    const result = await this.matchModel.create({ ...body, inProgress: true });
    return result;
  }
}
