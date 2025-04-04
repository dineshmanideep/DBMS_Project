import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Contributor = sequelize.define('Contributor', {
  repo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'Contributor'
  }
}, {
  tableName: 'Contributors',
  timestamps: false
});

export default Contributor;
