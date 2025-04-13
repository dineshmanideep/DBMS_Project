import { PullRequest, User, Branch,Repository,PullRequestReview } from '../models/index.js';

export const pullRequestController = {
  async getAllPRs(req, res) {
    try {
        console.log("hit get all prs",req.params)
      const { creator_id, repo_name } = req.params;
      const repo = await Repository.findOne({
        where: {
          repo_name: repo_name,
          creator_id: creator_id,
        },
      });
        
        if (!repo) {
          return res.status(404).json({ message: 'Repository not found' });
        }

        const branch = await Branch.findOne({
          where:{
            repo_id:repo.repo_id,
            name:'main'
          }
        })
        if(!Branch){
          return res.status(404).json({message:"branch not found"});
        }

      const pullRequests = await PullRequest.findAll({
        include: [{
          model: User,
          attributes: ['username']
        }, {
          model: Branch,
          as: 'baseBranch',
          attributes: ['name']
        }, {
          model: Branch,
          as: 'targetBranch',
          attributes: ['name']
        }],
        where: {
          base_branch_id:branch.branch_id
        },
        order: [['creation_date', 'DESC']]
      });

      res.json({
        message: "Successfully retrieved pull requests",
        data: pullRequests
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createPR(req, res) {
    try {
      const { pr_title, pr_description, base_branch_id, target_branch_id } = req.body;
      const { creator_id, repo_name } = req.params;
      const repo = await Repository.findOne({
        where: {
          repo_name: repo_name,
          creator_id: creator_id,
        },
      });
        
        if (!repo) {
          return res.status(404).json({ message: 'Repository not found' });
        }
      
      const pullRequest = await PullRequest.create({
        creator_id: req.user.user_id,
        pr_title,
        pr_description,
        base_branch_id,
        target_branch_id,
        repo_id: repo.repo_id
      });

      res.status(201).json({
        message: "Pull request created successfully",
        data: pullRequest
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getPRById(req, res) {
    try {
      const { pr_id, creator_id, repo_name } = req.params;
      console.log("find pull request");
      
      const pullRequest = await PullRequest.findOne({
        where: { pr_id },
        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
            model: Branch,
            as: 'baseBranch',
            attributes: ['name']
          },
          {
            model: Branch,
            as: 'targetBranch',
            attributes: ['name']
          }
        ]
      });

      const pull_Request_Reviews= await PullRequestReview.findAll({
        where:{
          pr_id
        },
        include:[
          {
            model:User,
            attributes:['username']
          }
        ]
      })

      if (!pullRequest) {
        console.log("no found pulll request")
        return res.status(404).json({ message: 'Pull request not found' });
      }

      res.json({
        message: 'Successfully retrieved pull request',
       pullRequest,
       pull_Request_Reviews
      });
    } catch (error) {
      console.log("error",error.message)
      res.status(500).json({ message: error.message });
    }
  },

  async createReview(req, res) {
    try {
      const { pr_id } = req.params;
      const { comment } = req.body;
      console.log(req.body,req.params,req.user.user_id);
      
      const review = await PullRequestReview.create({
        pr_id,
        reviewer_id: req.user.user_id,
        review_comments: comment
      });

      

      res.status(201).json({
        message: 'Review submitted successfully'
      });
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: error.message });
    }
  }
};