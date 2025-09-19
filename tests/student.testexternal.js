const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../app');

describe('API de Estudantes', () => {
  let token;
  before(async () => {
    // Login para obter token
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'admin' });
    token = res.body.token;
  });

  it('1 - Inserção de usuário realizada com sucesso', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'João', username: 'joao' });
  expect(res.statusCode).to.equal(201);
  expect(res.body).to.have.property('username', 'joao');
  });

  it('2 - Inserção de usuário duplicado, deverá retornar a mensagem que o usuário já existe no sistema', async () => {
    await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Maria', username: 'maria' });
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Maria', username: 'maria' });
  expect(res.statusCode).to.equal(400);
  expect(res.body).to.have.property('error', 'Usuário já existe no sistema');
  });

  it('3 - Lançamento de notas válidas, 0 a 10', async () => {
    await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carlos', username: 'carlos' });
    const res = await request(app)
      .post('/students/carlos/notas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nota: 8 });
  expect(res.statusCode).to.equal(200);
  expect(res.body.notas).to.include(8);
  });

  it('4 - Lançamento de notas inválidas; valores menor que 0 ou maior que 10', async () => {
    it('4 - Lançamento de notas inválidas; valores menor que 0 ou maior que 10', async () => {
      await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Ana', username: 'ana' });
      const res = await request(app)
        .post('/students/ana/notas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nota: 12 });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('error', 'Nota inválida');
    });

    it('5 - Não deve permitir mais de 3 notas', async () => {
      await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Limite', username: 'limite' });
      await request(app)
        .post('/students/limite/notas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nota: 8 });
      await request(app)
        .post('/students/limite/notas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nota: 7 });
      await request(app)
        .post('/students/limite/notas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nota: 6 });
      const res = await request(app)
        .post('/students/limite/notas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nota: 5 });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.contain('Máximo de 3 notas lançadas');
    });
  });
});
