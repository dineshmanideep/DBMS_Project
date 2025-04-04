import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PullRequestReview = sequelize.define('PullRequestReview', {
  pr_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  review_comments: DataTypes.TEXT,
  review_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Pull_Request_Reviews',
  timestamps: false
});

export default PullRequestReview;
