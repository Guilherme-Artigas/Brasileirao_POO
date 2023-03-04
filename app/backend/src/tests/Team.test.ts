import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes de Integração da rota /teams', () => {

  afterEach(() => sinon.restore());

  it('Busca lista completa de times...', async () => {
    const mockTeamsList = [{ id: 1, teamName: 'corinthians' }] as TeamModel[];
    sinon.stub(TeamModel, 'findAll').resolves(mockTeamsList);
    const result = await chai.request(app).get('/teams');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.deep.equal(mockTeamsList);
  });

  it('Busca times pelo ID...', async () => {
    const mockTeam = { id: 1, teamName: 'corinthians' } as TeamModel;
    sinon.stub(TeamModel, 'findOne').resolves(mockTeam);
    const result = await chai.request(app).get('/teams/1');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.deep.equal(mockTeam);
  });
});
