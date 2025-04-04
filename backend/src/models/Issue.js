import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Issue = sequelize.define('Issue', {
  issue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  repo_id: DataTypes.INTEGER,
  creator_id: DataTypes.INTEGER,
  issue_title: DataTypes.STRING(255),
  issue_description: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Open'
  },
  assignee_id: DataTypes.INTEGER,
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Issues',
  timestamps: false
});

export default Issue;
