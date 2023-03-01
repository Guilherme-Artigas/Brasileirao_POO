import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import ITeam from '../interfaces/TeamInterface';
import ITeamService from './interfaces/TeamServiceInterface';

export default class TeamService implements ITeamService {
  protected model: ModelStatic<TeamModel>;

  constructor() {
    this.model = TeamModel;
  }

  async getAllTeams(): Promise<ITeam[]> {
    const result = await this.model.findAll();
    return result;
  }

  async getTeamById(id: number): Promise<ITeam> {
    const result = await this.model.findOne({ where: { id } });
    return result as ITeam;
  }
}
