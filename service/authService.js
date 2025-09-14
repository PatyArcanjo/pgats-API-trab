const { users } = require('../model/userModel');

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Login ou senha inválidos');
  return user;
}

module.exports = { login };
