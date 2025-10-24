const { sequelize, User, Player } = require('./models');
const express = require('express');
const cors = require('cors');
const app = express();
const playerRoutes = require('./routes/playerRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

app.use('/api/players', playerRoutes);
// montar las rutas de auth bajo /api/auth para coincidir con el frontend
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Solo sincroniza User en desarrollo (no tocar otras tablas)
    await User.sync({ alter: true, logging: (msg) => console.log('[SQL]', msg) });
    console.log('User table is ready.');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;