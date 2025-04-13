import { Issue, Repository, User } from '../models/index.js';

export const getAllIssues = async (req, res) => {
    try {
        const { creator_id, repo_name } = req.params;

        
        const repository = await Repository.findOne({
            where: { creator_id, repo_name }
        });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Build where clause based on status filter
       

        const issues = await Issue.findAll({
            where:{
            repo_id:repository.repo_id
            },
          
            include: [{
                model: User,
                as: 'assignee',
                attributes: ['user_id', 'username', 'email','full_name']
            }, {
                model: User,
                as: 'creator',
                attributes: ['user_id', 'username']
            }],
            order: [['creation_date', 'DESC']]
        });

        res.status(200).json({
            message: "Successfully retrieved issues",
            data: issues
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getIssueById = async (req, res) => {
    try {
        console.log("get issue by id")
        const { issue_id, creator_id, repo_name } = req.params;

        // First verify repository exists
        const repository = await Repository.findOne({
            where: { creator_id, repo_name }
        });

        if (!repository) {
            console.log("repository not found")
            return res.status(404).json({ message: "Repository not found" });
        }

        // Get issue with associated user data
        const issue = await Issue.findOne({
            where: { 
                issue_id
            }
        });

        if (!issue) {
            console.log("issue not found")
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({
            message: "Successfully retrieved issue",
            data: issue
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const createIssue = async (req, res) => {
    try {
        const { creator_id, repo_name } = req.params;
        const { title, description, assignee_id } = req.body;

        // Find repository
        const repository = await Repository.findOne({
            where: { creator_id, repo_name }
        });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        const issue = await Issue.create({
            repo_id: repository.repo_id,
            creator_id: req.user.user_id,
            issue_title: title,
            issue_description: description,
            assignee_id: assignee_id || null,
            status: 'Open'
        });

        res.status(201).json({
            message: "Issue created successfully",
            data: issue
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateIssue = async (req, res) => {
    try {
        console.log("issues update",req.body)
        const { issue_id } = req.params;
        const { title, description, status, assignee_id } = req.body;

        const issue = await Issue.findByPk(issue_id);

        if (!issue) {
            console.log("error issue not found")
            return res.status(404).json({ message: "Issue not found" });
        }

        // Only creator can edit the issue
        if (issue.creator_id !== req.user.user_id&&issue.assignee_id!==req.user.user_id) {
            return res.status(403).json({ message: "Not authorized to edit this issue" });
        }
       console.log("assignee_id",assignee_id);
        await issue.update({
            issue_title: title || issue.issue_title,
            issue_description: description || issue.issue_description,
            status: status || issue.status,
            assignee_id: assignee_id===undefined? issue.assignee_id:assignee_id 
        });

        console.log("issue",issue.toJSON());

        res.status(200).json({
            message: "Issue updated successfully",
            data: issue
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};