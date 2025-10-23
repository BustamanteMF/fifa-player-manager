const { sequelize, User, Player } = require('./models');
const express = require('express');
const app = express();
const playerRoutes = require('./routes/playerRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/players', playerRoutes);
app.use('/auth', authRoutes);

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