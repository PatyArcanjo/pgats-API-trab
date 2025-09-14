const studentService = require('../service/studentService');
const authService = require('../service/authService');
const { generateToken, verifyToken } = require('../service/jwtService');

module.exports = {
  Query: {
    estudante: (_, { username }) => {
      const student = studentService.getStudent(username);
      if (!student) return null;
      return { ...student, notaFinal: studentService.getNotaFinal(username) };
    },
    estudantes: () => {
      return studentService.students.map(s => ({ ...s, notaFinal: studentService.getNotaFinal(s.username) }));
    }
  },
  Mutation: {
    registrarEstudante: (_, { name, username }, context) => {
      if (!context.user) throw new Error('Token JWT obrigatório');
      return studentService.addStudent({ name, username });
    },
    lancarNota: (_, { username, nota }, context) => {
      if (!context.user) throw new Error('Token JWT obrigatório');
      return studentService.addNota(username, nota);
    },
    login: (_, { username, password }) => {
      const user = authService.login(username, password);
      const token = generateToken({ username: user.username });
      return { username: user.username, token };
    }
  }
};
