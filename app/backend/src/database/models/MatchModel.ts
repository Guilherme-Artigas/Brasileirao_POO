import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatchModel extends Model {
  declare readonly id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchModel.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: INTEGER,
  },
  homeTeamId: {
    allowNull: false,
    field: 'home_team_id',
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  homeTeamGoals: {
    allowNull: false,
    field: 'home_team_goals',
    type: INTEGER,
  },
  awayTeamId: {
    allowNull: false,
    field: 'away_team_id',
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  awayTeamGoals: {
    allowNull: false,
    field: 'away_team_goals',
    type: INTEGER,
  },
  inProgress: {
    allowNull: false,
    field: 'in_progress',
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamModel.hasMany(MatchModel, { foreignKey: 'homeTeamId', as: 't1' });

MatchModel.belongsTo(TeamModel, { foreignKey: 'homeTeamId', as: 'homeTeam' });
MatchModel.belongsTo(TeamModel, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default MatchModel;
