// const Branch = require('../models/Branch');
import { Branch,Repository,User,Commit,Contributor,File } from '../models/index.js';

export const branchController = {
  // Create a new branch
  async create(req, res) {
    try {
      const { repo_name,  creator_id } = req.params;
     const {name}=req.body;
    // Step 1: Find the repo
    const repo = await Repository.findOne({
      where: {
        repo_name: repo_name,
        creator_id: creator_id,
      },
    });
      
      if (!repo) {
        return res.status(404).json({ message: 'Repository not found' });
      }

      const branch = await Branch.create({
        name,
        repo_id:repo.repo_id,
        creator_id:req.user.user_id
      });

      const commit=await Commit.create({
        branch_id:branch.branch_id,
        creator_id:req.user.user_id,
        commit_message:"added README.md"
      });

      //parent_branch_id is null if the branch is main
      branch.set({
        last_commit_id:commit.commit_id,
        base_commit_id:commit.commit_id
      });
    await branch.save();
      const file= await File.create({
        commit_id:commit.commit_id,
        file_name:'README.md',
        file_type:'text',
        file_size:1024,
        file_content:'This is the README file'
      });
      const contributer= await Contributor.findOne({
        where:{
          user_id:req.user.user_id,
          repo_id:repo.repo_id
        }
      })
      if(!contributer){
        const newContributer =await Contributor.create({
          repo_id:repo.repo_id,
          user_id:req.user.user_id,
          role:"Contributer"
        })
      }

      res.status(201).json(branch);
    } catch (error) {
      console.log("erorr",error.message)
      res.status(500).json({ error: error.message });
    }
  },

  // Get all branches for a repository
  async getAllByRepository(req, res) {
    try {
      const { repo_name,  creator_id } = req.params;

    // Step 1: Find the repo
    const repo = await Repository.findOne({
      where: {
        repo_name: repo_name,
        creator_id: creator_id,
      },
    });
 
    const branches = await Branch.findAll({
      attributes: ['branch_id', 'name'],
      where: { repo_id: repo.repo_id },
      include: [
        {
          model: User,
          attributes: ['username'] // creator of the branch
        },
        {
          model: Commit,
          as: 'lastCommit',
          attributes: ['commit_message', 'commit_timestamp'],
          include: [
            {
              model: User,
              attributes: ['username'], // author of the last commit
            }
          ]
        }
      ]
    });
      // console.log("data",branches.toString())
      res.json({message:"success",data:branches});
    } catch (error) {
      console.log("error",error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // Get branch by ID
  async getById(req, res) {
    try {
      const branch = await Branch.findByPk(req.params.id, {
        include: [{ model: Repository }]
      });
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update branch
  async update(req, res) {
    try {
      const { name, commitHash } = req.body;
      const branch = await Branch.findByPk(req.params.id);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      await branch.update({ name, commitHash });
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete branch
  async delete(req, res) {
    try {
      const branch = await Branch.findByPk(req.params.id);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      await branch.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

