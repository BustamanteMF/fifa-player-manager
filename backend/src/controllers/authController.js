const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

const authController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required' });
    }

    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const user = await User.create({ email, password, name });

      const userJson = user.toJSON();
      delete userJson.password;

      return res.status(201).json({ user: userJson });
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map((e) => e.message) });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

  // create a refresh token (longer expiry). In a production app you should store
  // refresh tokens server-side (DB) or use httpOnly cookies. This example returns
  // it in the response body for simplicity.
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

      const userSafe = { id: user.id, email: user.email, name: user.name };

      return res.json({ token, refreshToken, user: userSafe });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Exchange a refresh token for a new access token
  refresh: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const userId = decoded.userId;
      // Optionally validate that this refresh token is still valid (DB or blacklist)
      const newToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
      return res.json({ token: newToken });
    } catch (err) {
      console.error('Error refreshing token:', err);
      if (err && err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'refresh_token_expired' });
      }
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  },
};

module.exports = authController;
