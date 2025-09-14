const { students } = require('../model/studentModel');

function addStudent({ name, username }) {
  if (students.find(s => s.username === username)) {
    throw new Error('Usuário já existe no sistema');
  }
  const student = { name, username, notas: [0, 0, 0] };
  students.push(student);
  return student;
}

function getStudent(username) {
  return students.find(s => s.username === username);
}

function addNota(username, nota) {
  const student = getStudent(username);
  if (!student) throw new Error('Estudante não encontrado');
  if (student.notas.filter(n => n !== 0).length >= 3) throw new Error('Máximo de 3 notas lançadas');
  if (nota < 0 || nota > 10) throw new Error('Nota inválida');
  const idx = student.notas.findIndex(n => n === 0);
  if (idx === -1) throw new Error('Máximo de 3 notas lançadas');
  student.notas[idx] = nota;
  return student;
}

function getNotaFinal(username) {
  const student = getStudent(username);
  if (!student) throw new Error('Estudante não encontrado');
  const media = (student.notas.reduce((a, b) => a + b, 0)) / 3;
  return media;
}

module.exports = { addStudent, getStudent, addNota, getNotaFinal };
