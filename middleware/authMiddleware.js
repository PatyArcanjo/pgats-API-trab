const { verifyToken } = require('../service/jwtService');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não informado' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token Bearer ausente' });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Token inválido' });
  req.user = user;
  next();
}

module.exports = authMiddleware;
