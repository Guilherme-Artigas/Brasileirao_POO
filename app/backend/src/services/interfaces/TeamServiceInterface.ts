import ITeam from '../../interfaces/TeamInterface';

export default interface ITeamService {
  getAllTeams(): Promise<ITeam[]>
  // getTeamById(id: number): Promise<ITeam>;
}
