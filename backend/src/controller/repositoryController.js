import {Branch,Repository} from '../models/index.js';

export const repositoryController = {
  // Create a new repository
  async create(req, res) {
    try {
      const { name, description, path } = req.body;
      const repository = await Repository.create({
        name,
        description,
        path
      });

      // Create default main branch
      await Branch.create({
        name: 'main',
        commitHash: 'initial',
        repositoryId: repository.id
      });

      res.status(201).json(repository);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all repositories
  async getAll(req, res) {
    try {
      const repositories = await Repository.findAll({
        include: [{ model: Branch }]
      });
      res.json(repositories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get repository by ID
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

