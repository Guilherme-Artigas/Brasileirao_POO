import { ModelStatic } from 'sequelize';
import IlbService from './interfaces/LbServiceInterface';
import IPerformance from '../interfaces/IPerformance';

import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';

export default class LeaderBoardService implements IlbService {
  protected lbModel: ModelStatic<MatchModel>;
  protected teamModel: ModelStatic<TeamModel>;
  private _countGames: number;
  private _totalPoints: number;
  private _totalVictories: number;
  private _totalDraws: number;
  private _totalLosses: number;
  private _goalsFavor: number;
  private _goalsOwn: number;

  constructor() {
    this.lbModel = MatchModel;
    this.teamModel = TeamModel;
    this._countGames = 0;
    this._totalPoints = 0;
    this._totalVictories = 0;
    this._totalDraws = 0;
    this._totalLosses = 0;
    this._goalsFavor = 0;
    this._goalsOwn = 0;
  }

  totalGames(id: number, allMatches: MatchModel[]): number {
    this._countGames = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id) this._countGames += 1;
    });
    return this._countGames;
  }

  totalPoints(id: number, allMatches: MatchModel[]): number {
    this._totalPoints = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals > match.awayTeamGoals) {
        this._totalPoints += 3;
      }
      if (match.homeTeamId === id && match.homeTeamGoals === match.awayTeamGoals) {
        this._totalPoints += 1;
      }
    });
    return this._totalPoints;
  }

  totalVictories(id: number, allMatches: MatchModel[]): number {
    this._totalVictories = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals > match.awayTeamGoals) {
        this._totalVictories += 1;
      }
    });
    return this._totalVictories;
  }

  totalDraws(id: number, allMatches: MatchModel[]): number {
    this._totalDraws = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals === match.awayTeamGoals) {
        this._totalDraws += 1;
      }
    });
    return this._totalDraws;
  }

  totalLosses(id: number, allMatches: MatchModel[]): number {
    this._totalLosses = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals < match.awayTeamGoals) {
        this._totalLosses += 1;
      }
    });
    return this._totalLosses;
  }

  goalsFavor(id: number, allMatches: MatchModel[]): number {
    this._goalsFavor = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id) this._goalsFavor += match.homeTeamGoals;
    });
    return this._goalsFavor;
  }

  goalsOwn(id: number, allMatches: MatchModel[]): number {
    this._goalsOwn = 0;
    allMatches.forEach((match) => {
      if (match.homeTeamId === id) this._goalsOwn += match.awayTeamGoals;
    });
    return this._goalsOwn;
  }

  static tiebreaker(list: IPerformance[]): IPerformance[] {
    list.sort((a, b) =>
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn);
    return list;
  }

  async initialPerformance(): Promise<IPerformance[]> {
    const allMatches = await this.lbModel.findAll({ where: { inProgress: false } });
    const allTeams = await this.teamModel.findAll();
    const allPerformance = allTeams.map((team) => ({
      name: team.teamName,
      totalPoints: this.totalPoints(team.id, allMatches),
      totalGames: this.totalGames(team.id, allMatches),
      totalVictories: this.totalVictories(team.id, allMatches),
      totalDraws: this.totalDraws(team.id, allMatches),
      totalLosses: this.totalLosses(team.id, allMatches),
      goalsFavor: this.goalsFavor(team.id, allMatches),
      goalsOwn: this.goalsOwn(team.id, allMatches),
      goalsBalance: this.goalsFavor(team.id, allMatches) - this.goalsOwn(team.id, allMatches),
      efficiency: ((this.totalPoints(team.id, allMatches)
        / (this.totalGames(team.id, allMatches) * 3)) * 100).toFixed(2),
    }));
    LeaderBoardService.tiebreaker(allPerformance);
    return allPerformance;
  }
}
