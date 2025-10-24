// Lazy-load Sequelize and mysql2 at runtime to avoid bundling server-only modules into the client bundle
let _sequelize: any = null;
let _models: any = null;

async function initDatabase() {
  if (_sequelize && _models) return { sequelize: _sequelize, models: _models };

  const { Sequelize } = await import('sequelize');
  const mysql2 = await import('mysql2');
  const initModelsModule = await import('@/models/init-models');
  const initModels = initModelsModule.default || initModelsModule;

  const sequelize = new Sequelize(process.env.DB_NAME || 'silad-akad', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  });

  // Ensure connection
  await sequelize.authenticate();

  const models = initModels(sequelize);

  // Optionally sync in development only
  if (process.env.NODE_ENV !== 'production') {
    // await sequelize.sync();
  }

  _sequelize = sequelize;
  _models = models;

  return { sequelize: _sequelize, models: _models };
}

export { initDatabase };
export default initDatabase;
