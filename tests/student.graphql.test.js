const request = require('supertest');
const { expect } = require('chai');
const app = require('../graphql/app');

describe('API GraphQL de Estudantes', () => {
  let token;

  before(async () => {
    // Login para obter token JWT
    const query = `
      mutation {
        login(username: "admin", password: "admin") {
          token
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .send({ query });
    token = res.body.data.login.token;
  });

  it('1 - Registrar estudante via GraphQL', async () => {
    const mutation = `
      mutation {
        registrarEstudante(name: "João", username: "joao") {
          username
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation });
    expect(res.body.data.registrarEstudante.username).to.equal('joao');
  });

  it('2 - Registrar estudante duplicado via GraphQL', async () => {
    const mutation = `
      mutation {
        registrarEstudante(name: "Maria", username: "maria") {
          username
        }
      }
    `;
    await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation });
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation });
    expect(res.body.errors[0].message).to.equal('Usuário já existe no sistema');
  });

  it('3 - Lançar nota válida via GraphQL', async () => {
    const mutationEstudante = `
      mutation {
        registrarEstudante(name: "Carlos", username: "carlos") {
          username
        }
      }
    `;
    await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationEstudante });

    const mutationNota = `
      mutation {
        lancarNota(username: "carlos", nota: 8) {
          notas
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationNota });
    expect(res.body.data.lancarNota.notas).to.include(8);
  });

  it('4 - Lançar nota inválida via GraphQL', async () => {
    const mutationEstudante = `
      mutation {
        registrarEstudante(name: "Ana", username: "ana") {
          username
        }
      }
    `;
    await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationEstudante });

    const mutationNota = `
      mutation {
        lancarNota(username: "ana", nota: 12) {
          notas
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationNota });
    expect(res.body.errors[0].message).to.equal('Nota inválida');
  });
});
