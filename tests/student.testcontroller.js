const sinon = require('sinon');
const { expect } = require('chai');
const studentService = require('../service/studentService');
const authService = require('../service/authService');
const { estudantes, usuarios } = require('./fixtures/studentFixture');

describe('Controller de Estudantes (Mock)', () => {
  let addStudentStub, addNotaStub, getStudentStub, getNotaFinalStub, loginStub;

  beforeEach(() => {
    addStudentStub = sinon.stub(studentService, 'addStudent');
    addNotaStub = sinon.stub(studentService, 'addNota');
    getStudentStub = sinon.stub(studentService, 'getStudent');
    getNotaFinalStub = sinon.stub(studentService, 'getNotaFinal');
    loginStub = sinon.stub(authService, 'login');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('1 - Inserção de usuário realizada com sucesso', async () => {
    addStudentStub.returns(estudantes[0]);
    const result = studentService.addStudent({ name: estudantes[0].name, username: estudantes[0].username });
    expect(result).to.have.property('username', estudantes[0].username);
  });

  it('2 - Inserção de usuário duplicado, deverá retornar a mensagem que o usuário já existe no sistema', async () => {
    addStudentStub.throws(new Error('Usuário já existe no sistema'));
    try {
      studentService.addStudent({ name: estudantes[1].name, username: estudantes[1].username });
    } catch (err) {
      expect(err.message).to.equal('Usuário já existe no sistema');
    }
  });

  it('3 - Lançamento de notas válidas, 0 a 10', async () => {
    addNotaStub.returns(estudantes[2]);
    const result = studentService.addNota(estudantes[2].username, estudantes[2].notas[0]);
    expect(result.notas).to.include(estudantes[2].notas[0]);
  });

  it('4 - Lançamento de notas inválidas; valores menor que 0 ou maior que 10', async () => {
    addNotaStub.throws(new Error('Nota inválida'));
    try {
      studentService.addNota(estudantes[3].username, 12);
    } catch (err) {
      expect(err.message).to.equal('Nota inválida');
    }
  });
});
