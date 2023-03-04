import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { hashSync } from 'bcryptjs';
import generateToken from '../utils/Jwt';
import { verify } from 'jsonwebtoken';
import IJwt from '../interfaces/JwtInterface';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testes de integração da rota /login', () => {

  afterEach(() => sinon.restore());

  it('Gera Token...', async () => {
    const mockLoginUser = { email: 'user@user.com', password: 'secret_password' } as UserModel;
    const mockHash = hashSync(mockLoginUser.password);
    const mockResult = { id: 2, userName: 'User', role: 'user', email: 'user@user.com', password: mockHash } as UserModel;

    sinon.stub(UserModel, 'findOne').resolves(mockResult);

    const mockPayload = { id: mockResult.id, role: mockResult.role };
    const token = generateToken(mockPayload);
    const response = await chai.request(app).post('/login').send(mockLoginUser);

    expect(response.status).to.be.equal(200);
    expect(response.body.token).to.be.equal(token);
  });

  it('Mensagem de erro, caso requisição não possua email ou senha...', async () => {
    const mockLoginUser = { password: 'qualquerCoisa' };
    const response = await chai.request(app).post('/login').send(mockLoginUser);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Mensagem de erro, caso email informado naõ esteja cadastrado no banco de dados...', async () => {
    const mockLoginUser = { email: 'userMock@user.com', password: '123456789' };

    sinon.stub(UserModel, 'findOne').resolves(undefined);

    const response = await chai.request(app).post('/login').send(mockLoginUser);
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Existe token na requisição...', async () => {
    const mockLoginUser = { req: { headers: { authorization: '' } } };
    const response = await chai.request(app).get('/login/role').send(mockLoginUser);

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
  });

  it('Token informado é válido...', async () => {
    const token = generateToken({ id: 1, role: 'admin' });
    const mockLoginUser = { req: { headers: { authorization: token } } };
    const user = verify(mockLoginUser.req.headers.authorization, 'jwt_secret') as IJwt;
    const response = await chai.request(app).get('/login/role').set({authorization: token}).send(mockLoginUser);

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal({ role: user.role });
  });

  it('Mensagem de erro, para token inválido...', async () => {
    const token = generateToken({ id: 5, role: 'user' });
    const mockLoginUser = { req: { headers: { authorization: `${token}5` } } };
    const response = await chai.request(app)
      .get('/login/role')
      .set({authorization: 'aa' })
      .send(mockLoginUser);

    expect(response.status).to.be.equal(401);
  });
});
