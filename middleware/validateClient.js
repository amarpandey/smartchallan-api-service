const { verifyToken } = require('../utils/jwt');

function validateClient(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'MISSING_TOKEN', message: 'Authorization: Bearer <token> header is required' });
  }

  const token = header.slice(7).trim();
  if (!token) return res.status(401).json({ error: 'MISSING_TOKEN', message: 'Empty bearer token' });

  try {
    req.client = verifyToken(token);
    return next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ error: code, message: err.message });
  }
}

module.exports = validateClient;
