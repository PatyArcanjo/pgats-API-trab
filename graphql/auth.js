const { verifyToken } = require('../service/jwtService');

function getUserFromToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  const user = verifyToken(token);
  return user || null;
}

module.exports = { getUserFromToken };
