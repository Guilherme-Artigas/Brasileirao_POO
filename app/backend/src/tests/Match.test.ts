import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes de integração da rota /matches', () => {

  afterEach(() => sinon.restore());

  it('Verifica se retorna as informações de todas as partidas', async () => {
    const mockMatches = [
      {
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 1,
        awayTeamId: 8,
        awayTeamGoals: 1,
        inProgress: false,
        // homeTeam: {
        //   teamName: 'São Paulo',
        // },
        // awayTeam: {
        //   teamName: 'Grêmio',
        // }
      },
    ] as MatchModel[];
    sinon.stub(MatchModel, 'findAll').resolves(mockMatches);
    const response = await chai.request(app).get('/matches');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(mockMatches);
  });
});
