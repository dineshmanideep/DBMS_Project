import { Branch, File, Repository,Commit, User,Contributor } from "../models/index.js";
import sequelize from "../config/database.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const fetchAllFiles = async (req, res) => {
  try {
    const { repo_name, branch_name, creator_id } = req.params;

    // Step 1: Find the repo
    const repo = await Repository.findOne({
      where: {
        repo_name: repo_name,
        creator_id: creator_id,
      },
    });

    if (!repo) throw new Error("Repository not found");

    // Step 2: Find the branch
    const [branch] = await sequelize.query(
      `SELECT * FROM Branches WHERE repo_id = ? AND name = ? LIMIT 1`,
      {
        replacements: [repo.repo_id, branch_name],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!branch) throw new Error("Branch not found");

    // Step 3: Get latest version of each file and join with Commits
    const files = await sequelize.query(
      `
      SELECT f.file_name,f.file_id, c.commit_message, c.commit_timestamp, c.creator_id AS commit_creator_id,u.username AS username
      FROM Files f
      INNER JOIN (
        SELECT file_name, MAX(commit_id) AS latest_commit_id
        FROM Files
        WHERE commit_id IN (
          SELECT commit_id FROM Commits WHERE branch_id = ?
        )
        GROUP BY file_name
      ) latest_files
        ON f.file_name = latest_files.file_name AND f.commit_id = latest_files.latest_commit_id
      INNER JOIN Commits c ON f.commit_id = c.commit_id
      INNER JOIN Users u ON u.user_id=c.creator_id
      `,
      {
        replacements: [branch.branch_id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({ message: "success", data: files });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export const createFile=async (req, res) => {
  try {
    const {creator_id,repo_name,branch_name}= req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
     
    const repo = await Repository.findOne({
        where: {
          repo_name: repo_name,
          creator_id: creator_id,
        },
      });
  
      if (!repo) throw new Error("Repository not found");
  
      // Step 2: Find the branch
      const [branch] = await sequelize.query(
        `SELECT * FROM Branches WHERE repo_id = ? AND name = ? LIMIT 1`,
        {
          replacements: [repo.repo_id, branch_name],
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      if (!branch) throw new Error("Branch not found");

    const commit = await Commit.create({
        branch_id:branch.branch_id,
        creator_id:req.user.user_id,
        commit_message:`added ${req.file.originalname}`
    })
   
    const newFile = await File.create({
      file_name: req.file.originalname,
      file_content: req.file.buffer,
      file_size: req.file.size,
      file_type:req.file_type,
      commit_id:commit.commit_id
    });

    //if user is not in contributers table then add him as contributer
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
        role:"Contributor"
      })
    }

    res.status(201).json({ message: 'File uploaded and stored in DB', file: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};


export const fetchFileByName = async (req, res) => {
  try {
    const { repo_name, branch_name, creator_id, file_name, commit_id } = req.params;
    
    // Find repository
    const repo = await Repository.findOne({ where: { repo_name, creator_id } });
    if (!repo) throw new Error("Repository not found");

    // Find branch
    const [branch] = await sequelize.query(
      `SELECT * FROM Branches WHERE repo_id = ? AND name = ? LIMIT 1`,
      { replacements: [repo.repo_id, branch_name], type: sequelize.QueryTypes.SELECT }
    );
    if (!branch) throw new Error("Branch not found");

    let fileQuery;
    let queryReplacements;

    if (commit_id) {
      // Get specific version of file from commit
      fileQuery = `
        SELECT 
          f.file_name, 
          f.file_content, 
          c.commit_message, 
          c.commit_timestamp,
          u.username as author
        FROM Files f
        INNER JOIN Commits c ON c.commit_id = f.commit_id
        INNER JOIN Users u ON u.user_id = c.creator_id
        WHERE f.commit_id = ? 
        AND f.file_name = ?
        AND c.branch_id = ?
      `;
      queryReplacements = [commit_id, file_name, branch.branch_id];
    } else {
      // Get latest version of file
      fileQuery = `
        SELECT 
          f.file_name, 
          f.file_content, 
          c.commit_message, 
          c.commit_timestamp,
          u.username as author
        FROM Files f
        INNER JOIN (
          SELECT MAX(commit_id) AS latest_commit_id
          FROM Files
          WHERE file_name = ? AND commit_id IN (
            SELECT commit_id FROM Commits WHERE branch_id = ?
          )
        ) latest ON f.commit_id = latest.latest_commit_id
        INNER JOIN Commits c ON c.commit_id = f.commit_id
        INNER JOIN Users u ON u.user_id = c.creator_id
        WHERE f.file_name = ?
      `;
      queryReplacements = [file_name, branch.branch_id, file_name];
    }

    const [file] = await sequelize.query(fileQuery, {
      replacements: queryReplacements,
      type: sequelize.QueryTypes.SELECT
    });

    if (!file) {
      return res.status(404).json({ 
        error: commit_id ? 
          'File version not found in this commit' : 
          'File not found in this branch'
      });
    }

    // Convert buffer to string if it exists
    const content = file.file_content ? file.file_content.toString('utf-8') : '';

    res.status(200).json({
      file_name: file.file_name,
      content,
      commit_message: file.commit_message,
      commit_timestamp: file.commit_timestamp,
      author: file.author,
      commit_id: commit_id || file.commit_id
    });

  } catch (err) {
    console.error("Fetch file error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const updateFile = async (req, res) => {
  try {
    const { repo_name, branch_name, creator_id, file_name } = req.params;
    const { content, commit_message } = req.body;

    const repo = await Repository.findOne({ where: { repo_name, creator_id } });
    if (!repo) throw new Error("Repository not found");

    const [branch] = await sequelize.query(
      `SELECT * FROM Branches WHERE repo_id = ? AND name = ? LIMIT 1`,
      { replacements: [repo.repo_id, branch_name], type: sequelize.QueryTypes.SELECT }
    );
    if (!branch) throw new Error("Branch not found");

    const commit = await Commit.create({
      branch_id: branch.branch_id,
      creator_id: req.user.user_id,
      commit_message: commit_message || `Updated ${file_name}`
    });

    const updatedFile = await File.create({
      file_name,
      file_content: Buffer.from(content, 'utf-8'),
      mime_type: 'text/plain',
      file_type: 'text',
      file_size: content.length,
      commit_id: commit.commit_id
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
        role:"Contributor"
      })
    }
    res.status(201).json({ message: "File updated and new version created", file: updatedFile });
  } catch (err) {
    console.error("Update file error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getFileHistory = async (req, res) => {
  try {
    const { repo_name, branch_name, creator_id, file_name } = req.params;

    const repo = await Repository.findOne({ 
      where: { repo_name, creator_id } 
    });
    
    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    const branch = await Branch.findOne({
      where: { 
        repo_id: repo.repo_id,
        name: branch_name
      }
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Get commit history without file content
    const commitHistory = await sequelize.query(`
      SELECT DISTINCT
        c.commit_id,
        c.commit_message,
        c.commit_timestamp,
        u.username,
        u.avatar
      FROM Commits c
      INNER JOIN Files f ON f.commit_id = c.commit_id
      INNER JOIN Users u ON c.creator_id = u.user_id
      WHERE c.branch_id = :branchId
      AND f.file_name = :fileName
      ORDER BY c.commit_timestamp DESC
    `, {
      replacements: {
        branchId: branch.branch_id,
        fileName: file_name
      },
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      message: 'success',
      data: commitHistory
    });

  } catch (error) {
    console.error('Get file history error:', error);
    res.status(500).json({ message: error.message });
  }
};