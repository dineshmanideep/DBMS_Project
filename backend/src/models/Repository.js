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
  },
  stars:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  forks:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  license:{
    type:DataTypes.STRING(255),
    defaultValue:'MIT License'
  },
  language:{
    type:DataTypes.STRING(255),
    allowNull:true
  },
  languageColor:{
    type:DataTypes.STRING(255),
    allowNull:true
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  }
}, {
  tableName: 'Repositories',
  timestamps: false
});

export default Repository;
