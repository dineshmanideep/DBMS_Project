// const Branch = require('../models/Branch');
import { Branch,Repository } from '../models/index.js';

const branchController = {
  // Create a new branch
  async create(req, res) {
    try {
      const { name, repositoryId, commitHash } = req.body;
      const repository = await Repository.findByPk(repositoryId);
      
      if (!repository) {
        return res.status(404).json({ message: 'Repository not found' });
      }

      const branch = await Branch.create({
        name,
        repositoryId,
        commitHash: commitHash || 'initial'
      });

      res.status(201).json(branch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all branches for a repository
  async getAllByRepository(req, res) {
    try {
      const { repositoryId } = req.params;
      const branches = await Branch.findAll({
        where: { repositoryId },
        include: [{ model: Repository }]
      });
      res.json(branches);
    } catch (error) {
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

module.exports = branchController;