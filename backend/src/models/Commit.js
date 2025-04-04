import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Commit = sequelize.define('Commit', {
  commit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  branch_id: DataTypes.INTEGER,
  creator_id: DataTypes.INTEGER,
  commit_message: DataTypes.TEXT,
  commit_timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Commits',
  timestamps: false
});

export default Commit;
