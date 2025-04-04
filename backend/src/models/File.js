import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const File = sequelize.define('File', {
  file_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  commit_id: DataTypes.INTEGER,
  file_name: DataTypes.STRING(255),
  file_type: DataTypes.STRING(50),
  file_size: DataTypes.BIGINT,
  file_content: DataTypes.BLOB('long'),
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Files',
  timestamps: false
});

export default File;
