import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PullRequest = sequelize.define('PullRequest', {
  pr_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creator_id: DataTypes.INTEGER,
  pr_title: DataTypes.STRING(255),
  pr_description: DataTypes.TEXT,
  pr_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Open'
  },
  base_branch_id: DataTypes.INTEGER,
  target_branch_id: DataTypes.INTEGER,
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Pull_Requests',
  timestamps: false
});

export default PullRequest;
