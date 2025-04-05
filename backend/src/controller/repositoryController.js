import {Branch,Repository,Commit,File} from '../models/index.js';

export const repositoryController = {
  // Create a new repository
  async create(req, res) {
    try {
      const { repo_name, description, visibility } = req.body;
      console.log("hit create repo ",req.user);
      const repository = await Repository.create({
        repo_name,
        description,
        visibility,
        creator_id:req.user.user_id
      });

    //   // Create default main branch
     const branch= await Branch.create({
        name: 'main',
        repo_id: repository.repo_id,
        creator_id: req.user.user_id,   
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

     // when you do .json automatically the repository metadata is removed
      res.status(201).json(repository);
      // res.status(201).json({message:"done"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all public repositories
  async getAll(req, res) {
    try {
      const repositories = await Repository.findAll({
       where:{
        visibility:'Public'
       }
      });
      res.json(repositories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get repository by ID and user can or cannot see based on it is present or not
  async getById(req, res) {
    try {
      const repository = await Repository.findByPk(req.params.id, {
        include: [{ model: Branch }]
      });
      if (!repository) {
        return res.status(404).json({ message: 'Repository not found' });
      }
      res.json(repository);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update repository
  async update(req, res) {
    try {
      const { name, description } = req.body;
      const repository = await Repository.findByPk(req.params.id);
      if (!repository) {
        return res.status(404).json({ message: 'Repository not found' });
      }
      await repository.update({ name, description });
      res.json(repository);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete repository
  async delete(req, res) {
    try {
      const repository = await Repository.findByPk(req.params.id);
      if (!repository) {
        return res.status(404).json({ message: 'Repository not found' });
      }
      await repository.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

