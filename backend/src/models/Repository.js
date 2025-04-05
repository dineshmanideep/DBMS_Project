import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Repository = sequelize.define('Repository', {
  repo_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creator_id: DataTypes.INTEGER,
  repo_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: DataTypes.TEXT,
  visibility: {
    type: DataTypes.STRING(50),
    defaultValue: 'Public' //'Private'
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Repositories',
  timestamps: false
});

export default Repository;
