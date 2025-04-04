import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Branch = sequelize.define('Branch', {
  branch_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  repo_id: DataTypes.INTEGER,
  name: DataTypes.STRING(255),
  creator_id: DataTypes.INTEGER,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_commit_id: DataTypes.INTEGER,
  parent_branch_id: DataTypes.INTEGER,
  base_commit_id: DataTypes.INTEGER
}, {
  tableName: 'Branches',
  timestamps: false
});

export default Branch;
