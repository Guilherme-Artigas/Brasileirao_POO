import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
// import IdErrorHandling from "../midd/IdNotFound";

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes de Integração da rota /teams', () => {

  afterEach(() => sinon.restore());

  it('Verifica se é possível obter a lista de todos os times através do método GET, na rota /teams', async () => {
    const mockTeamsList = [{ id: 1, teamName: 'corinthians' }] as TeamModel[];
    sinon.stub(TeamModel, 'findAll').resolves(mockTeamsList);
    const result = await chai.request(app).get('/teams');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.deep.equal(mockTeamsList);
  });

  // it('Verifica se é possível buscar times pelo ID', async () => {
  //   const mockTeam = { id: 1, teamName: 'corinthians' } as TeamModel;
  //   sinon.stub(TeamModel, 'findOne').resolves(mockTeam);
  //   const result = await chai.request(app).get('/teams/1');
  //   expect(result.status).to.be.equal(200);
  //   expect(result.body).to.be.deep.equal(mockTeam);
  // });

  // it('Verifica se retorna 404, para IDs inexistentes', async () => {
  //   const error = new IdErrorHandling('ID não encontrado') as TeamModel;
  //   sinon.stub(TeamModel, 'findOne').resolves(null);
  //   const result = await chai.request(app).get('/teams/35');
  //   expect(result).to.be.equal(Error);
  // });
});
