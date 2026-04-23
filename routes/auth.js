const express = require('express');
const bcrypt  = require('bcryptjs');
const router  = express.Router();
const { User } = require('../models');
const { signToken } = require('../utils/jwt');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'MISSING_CREDENTIALS', message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    const u = user.toJSON();
    if ((u.status || '').toLowerCase() !== 'active') {
      return res.status(403).json({ error: 'ACCOUNT_INACTIVE' });
    }

    const ok = bcrypt.compareSync(String(password).trim(), u.password);
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    const token = signToken({
      id:        u.id,
      email:     u.email,
      client_id: u.id,
      role:      'api_client',
    });

    await User.update({ last_login_at: new Date() }, { where: { id: u.id } });

    res.json({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '12h',
      client: { id: u.id, name: u.name, email: u.email },
    });
  } catch (err) {
    console.error('[auth/login] error:', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
