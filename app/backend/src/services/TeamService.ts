import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import ITeam from '../interfaces/TeamInterface';
import ITeamService from './interfaces/TeamServiceInterface';

export default class TeamService implements ITeamService {
  protected teamModel: ModelStatic<TeamModel>;

  constructor() {
    this.teamModel = TeamModel;
  }

  async getAllTeams(): Promise<ITeam[]> {
    const result = await this.teamModel.findAll();
    return result;
  }

  async getTeamById(id: number): Promise<ITeam> {
    const result = await this.teamModel.findByPk(id);
    return result as ITeam;
  }
}
