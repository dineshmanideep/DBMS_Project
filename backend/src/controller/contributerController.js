import { Contributor, Repository, User, Commit, Branch } from "../models/index.js";
import { Op } from "sequelize";


//get all conrtributers data for the repo contributers page showing all the stats
export const getAllContributers = async (req, res) => {
    try {
        const { creator_id, repo_name } = req.params;

        // Find the repository
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            },
            attributes: ['repo_id', 'visibility']
        });

        if (!repository) {
            return res.status(404).json({ 
                message: "Repository not found" 
            });
        }

        // Get all contributors with their user details
        const contributors = await Contributor.findAll({
            where: {
                repo_id: repository.repo_id
            },
            include: [{
                model: User,
                attributes: ['user_id', 'username', 'email', 'full_name', 'registration_date']
            }],
            attributes: ['role', 'user_id']
        });

        // Get detailed stats for each contributor
        const contributorsWithDetails = await Promise.all(
            contributors.map(async (contributor) => {
                // Get branches created by contributor
                const branches = await Branch.findAll({
                    where: {
                        repo_id: repository.repo_id,
                        creator_id: contributor.user_id
                    }
                });

                const allBranches= await Branch.findAll({
                    where:{
                        repo_id:repository.repo_id
                    }
                })

                // Get commit details
                const commits = await Commit.findAll({
                    where: {
                        creator_id: contributor.user_id,
                        branch_id: {
                            [Op.in]: allBranches.map(branch => branch.branch_id)
                        }
                    },
                    order: [['commit_timestamp', 'DESC']],
                    attributes: ['commit_id', 'commit_timestamp', 'commit_message']
                });

                return {
                     user_id: contributor.User.user_id,
                    username: contributor.User.username,
                    fullName: contributor.User.full_name || contributor.User.username,
                    email: contributor.User.email,
                    role: contributor.role,
                    contributions: commits.length,
                    branches_created: branches.length,
                    firstContribution: commits.length > 0 ? 
                        commits[commits.length - 1].commit_timestamp : null,
                    last_contribution: commits.length > 0 ? 
                        commits[0].commit_timestamp : null,
                    joinedAt: contributor.User.registration_date,
                    recent_commits: commits.slice(0, 5).map(commit => ({
                        id: commit.commit_id,
                        message: commit.commit_message,
                        timestamp: commit.commit_timestamp
                    }))
                };
            })
        );

        res.status(200).json({
            message: "Successfully retrieved contributors",
            data: {
                contributors: contributorsWithDetails,
                isPrivate: repository.visibility === 'Private',
                total_contributors: contributorsWithDetails.length,
                total_commits: contributorsWithDetails.reduce((sum, c) => sum + c.contributions, 0)
            }
        });

    } catch (error) {
        console.error("Error in getAllContributers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

//function for the settings page to list all contributers
export const listAllContributers =async(req,res)=>{
    try {
        const {creator_id,repo_name}=req.params;
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            }
        });
        if (!repository) {
            return res.status(404).json({ 
                message: "Repository not found" 
            });
        }
        const contributors = await Contributor.findAll({
            where: {
                repo_id: repository.repo_id
            },
            include:[{
                model:User
            }]
        });
        
        res.status(200).json({message:"success",data:contributors});


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getCurrentContributer= async(req,res)=>{
    try {
        const {creator_id,repo_name}=req.params;
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            }
        });
        if (!repository) {
            return res.status(404).json({ 
                message: "Repository not found" 
            });
        }
        const contributor = await Contributor.findOne({
            where: {
                repo_id: repository.repo_id,
                user_id:req.user.user_id
            },
        });

        res.status(200).json({message:"success",data:contributor});


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Add new contributor
export const addContributor = async (req, res) => {
    try {
        console.log("add contribuer hit",req.body)
        const { creator_id, repo_name } = req.params;
        const {username,role}=req.body;

        // Find repository
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            }
        });

        if (!repository) {
            console.log("repo not found");
            return res.status(404).json({ message: "Repository not found" });
        }

         const reqUser= await User.findOne({
            where:{
                username:username
            }
         });
         if(!reqUser){
            console.log("User not found");
            return res.status(404).json({message:"User not found"});
         }
        // Check if already a contributor
        const existingContributor = await Contributor.findOne({
            where: {
                repo_id: repository.repo_id,
                user_id: reqUser.user_id
            }
        });

        if (existingContributor) {
            console.log("user already contributer")
            return res.status(400).json({ message: "User is already a contributor" });
        }

        // Create new contributor
        const newContributor = await Contributor.create({
            repo_id: repository.repo_id,
            user_id: reqUser.user_id,
            role: role
        });

        res.status(201).json({
            message: "Contributor added successfully"
            
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Remove contributor
export const removeContributor = async (req, res) => {
    try {
        const { creator_id, repo_name, user_id } = req.params;

        // Find repository
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            }
        });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Delete contributor
        const result = await Contributor.destroy({
            where: {
                repo_id: repository.repo_id,
                user_id: user_id
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: "Contributor not found" });
        }

        res.status(200).json({ message: "Contributor removed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update contributor role
export const updateContributorRole = async (req, res) => {
    try {
        const { creator_id, repo_name, user_id } = req.params;
        const { role } = req.body;

        // Find repository
        const repository = await Repository.findOne({
            where: {
                creator_id: creator_id,
                repo_name: repo_name
            }
        });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Update role
        const [updated] = await Contributor.update(
            { role: role },
            {
                where: {
                    repo_id: repository.repo_id,
                    user_id: user_id
                }
            }
        );

        if (updated === 0) {
            return res.status(404).json({ message: "Contributor not found" });
        }

        res.status(200).json({ message: "Role updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


