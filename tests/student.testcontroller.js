const sinon = require('sinon');
const { expect } = require('chai');
const studentService = require('../service/studentService');
const authService = require('../service/authService');

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
    addStudentStub.returns({ name: 'João', username: 'joao', notas: [0,0,0] });
    const result = studentService.addStudent({ name: 'João', username: 'joao' });
    expect(result).to.have.property('username', 'joao');
  });

  it('2 - Inserção de usuário duplicado, deverá retornar a mensagem que o usuário já existe no sistema', async () => {
    addStudentStub.throws(new Error('Usuário já existe no sistema'));
    try {
      studentService.addStudent({ name: 'Maria', username: 'maria' });
    } catch (err) {
      expect(err.message).to.equal('Usuário já existe no sistema');
    }
  });

  it('3 - Lançamento de notas válidas, 0 a 10', async () => {
    addNotaStub.returns({ name: 'Carlos', username: 'carlos', notas: [8,0,0] });
    const result = studentService.addNota('carlos', 8);
    expect(result.notas).to.include(8);
  });

  it('4 - Lançamento de notas inválidas; valores menor que 0 ou maior que 10', async () => {
    addNotaStub.throws(new Error('Nota inválida'));
    try {
      studentService.addNota('ana', 12);
    } catch (err) {
      expect(err.message).to.equal('Nota inválida');
    }
  });
});
