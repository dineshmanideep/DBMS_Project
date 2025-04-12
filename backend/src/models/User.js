import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  full_name: DataTypes.STRING(255),
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  avatar:{
    type:DataTypes.STRING(255),
    allowNull:true
  },
  bio:{
    type:DataTypes.STRING(255),
    allowNull:true
  },
  location:{
    type:DataTypes.STRING(255),
    allowNull:true
  },
  website:{
    type:DataTypes.STRING(255),
    allowNull:true
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User;
