import { Branch, Commit, Repository,User } from "../models/index.js";

export const getAllcommits = async(req,res)=>{
    
    try {
        const {branch_name,repo_name,creator_id}=req.params;  
        const repo=await Repository.findOne({
            where:{
                creator_id:creator_id,
                repo_name:repo_name
            }
        })
        if(!repo) throw error("unable to find the repository")
        const branch=await Branch.findOne({
            where:{
                repo_id:repo.repo_id,
                name:branch_name
            }
        })
        if(!branch) throw error("unable to find the branch")
        const commits = await Commit.findAll({
            where: {
              branch_id: branch.branch_id
            },
            include:{
                model:User,
                attributes:['username']
            },
            order: [['commit_timestamp', 'DESC']]
          });

          if(!commits)
            throw error("unable to find commits")

          res.status(200).json({message:"success",data:commits});
          
    } catch (error) {
       console.log(error); 
       res.status(500).json({message:error});
    }
}