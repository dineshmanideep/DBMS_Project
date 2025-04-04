// config/database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('my_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
