import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'todolist_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    retry: {
      max: 3,
      timeout: 3000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    },
    define: {
      timestamps: true,
      underscored: false
    }
  }
);

export default sequelize;
