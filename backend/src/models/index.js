import User from './User.js';
import Repository from './Repository.js';
import Branch from './Branch.js';
import Commit from './Commit.js';
import File from './File.js';
import PullRequest from './PullRequest.js';
import PullRequestReview from './PullRequestReview.js';
import Issue from './Issue.js';
import Contributor from './Contributor.js';

// Define associations below

User.hasMany(Repository, { foreignKey: 'creator_id' });
Repository.belongsTo(User, { foreignKey: 'creator_id' });

Repository.hasMany(Branch, { foreignKey: 'repo_id' });
Branch.belongsTo(Repository, { foreignKey: 'repo_id' });

User.hasMany(Branch, { foreignKey: 'creator_id' });
Branch.belongsTo(User, { foreignKey: 'creator_id' });

Branch.hasMany(Commit, { foreignKey: 'branch_id' });
Commit.belongsTo(Branch, { foreignKey: 'branch_id' });

User.hasMany(Commit, { foreignKey: 'creator_id' });
Commit.belongsTo(User, { foreignKey: 'creator_id' });

Commit.hasMany(File, { foreignKey: 'commit_id' });
File.belongsTo(Commit, { foreignKey: 'commit_id' });

PullRequest.belongsTo(User, { foreignKey: 'creator_id' });
PullRequest.belongsTo(Branch, { as: 'baseBranch', foreignKey: 'base_branch_id' });
PullRequest.belongsTo(Branch, { as: 'targetBranch', foreignKey: 'target_branch_id' });

PullRequestReview.belongsTo(PullRequest, { foreignKey: 'pr_id' });
PullRequestReview.belongsTo(User, { foreignKey: 'reviewer_id' });

Issue.belongsTo(User, { foreignKey: 'creator_id' });
Issue.belongsTo(User, { foreignKey: 'assignee_id' });
Issue.belongsTo(Repository, { foreignKey: 'repo_id' });

Contributor.belongsTo(Repository, { foreignKey: 'repo_id' });
Contributor.belongsTo(User, { foreignKey: 'user_id' });

// Export all models
export {
  User,
  Repository,
  Branch,
  Commit,
  File,
  PullRequest,
  PullRequestReview,
  Issue,
  Contributor
};
