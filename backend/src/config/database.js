// config/database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('my_db', 'devuser', 'Jaivant@123', {
  host: 'localhost',
  dialect: 'mysql',
  logging:true
});

export default sequelize;
