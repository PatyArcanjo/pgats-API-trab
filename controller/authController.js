const authService = require('../service/authService');
const { generateToken } = require('../service/jwtService');

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    const user = authService.login(username, password);
    const token = generateToken({ username: user.username });
    res.json({ message: 'Login realizado com sucesso', token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
