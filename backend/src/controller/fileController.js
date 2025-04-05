import { Branch, File, Repository,Commit } from "../models/index.js";
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
      SELECT f.file_name,f.file_id, c.commit_message, c.commit_timestamp, c.creator_id AS commit_creator_id
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
      `,
      {
        replacements: [branch.branch_id],
        type: sequelize.QueryTypes.SELECT,
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
      mime_type: req.file.mimetype,
      file_size: req.file.size,
      file_type:req.file_type,
      commit_id:commit.commit_id
    });

    res.status(201).json({ message: 'File uploaded and stored in DB', file: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};




