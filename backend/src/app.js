const { sequelize, User, Player } = require('./models');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log('Syncing only User model (will create/alter users table if needed)...');
    await User.sync({ alter: true, logging: (msg) => console.log('[SQL]', msg) });
    console.log('User table is ready.');

    const user = await User.create({
      email: 'test1@example.com',
      password: 'password123',
      name: 'TestUser',
    });
    console.log('User created successfully:', user.toJSON());
  } catch (error) {
    console.error('User test failed:', error);
  } finally {
    await sequelize.close();
  }
}

main();