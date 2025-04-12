import {Branch,Repository,Commit,File,Contributor} from '../models/index.js';

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
          role:"Admin"
        })
      }

     // when you do .json automatically the repository metadata is removed
      res.status(201).json({message:"true",data:repository});
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
      res.json({message:"true",data:repositories});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get repository by ID and user can or cannot see based on it is present or not
  async getById(req, res) {
    try {
      const {creator_id,repo_name}=req.params;
      const repo = await Repository.findOne({
        where: {
          repo_name: repo_name,
          creator_id: creator_id,
        },
      });
  
      if (!repo) throw new Error("Repository not found");
      res.json({message:"true",data:repo});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update repository
// Update the update function
async update(req, res) {
  try {
    const { creator_id, repo_name } = req.params;
    const { description, visibility, new_repo_name } = req.body;
    console.log("hit update repo",req.body)

    // Find repository with creator validation
    const repository = await Repository.findOne({
      where: {
        creator_id: creator_id,
        repo_name: repo_name
      }
    });

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check if user is admin
    const contributor = await Contributor.findOne({
      where: {
        repo_id: repository.repo_id,
        user_id: req.user.user_id,
        role: 'Admin'
      }
    });

    if (!contributor) {
      return res.status(403).json({ message: "Only admin can update repository settings" });
    }

    // If new repo name is provided, check if it already exists
    if (new_repo_name!=repository.repo_name) {
      const existingRepo = await Repository.findOne({
        where: {
          creator_id: creator_id,
          repo_name: new_repo_name
        }
      });

      if (existingRepo) {
        return res.status(400).json({ message: "Repository name already exists" });
      }
    }

    // Update repository
    await repository.update({
      repo_name: new_repo_name || repository.repo_name,
      description: description || repository.description,
      visibility: visibility || repository.visibility
    });

    res.json({
      message: "true",
      data: repository
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

// Update the delete function
async delete(req, res) {
  try {
    console.log("delete repo")
    const { creator_id, repo_name } = req.params;

    // Find repository
    const repository = await Repository.findOne({
      where: {
        creator_id: creator_id,
        repo_name: repo_name
      }
    });

    if (!repository) {
      console.log("not found repo")
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check if user is admin
    const contributor = await Contributor.findOne({
      where: {
        repo_id: repository.repo_id,
        user_id: req.user.user_id,
        role: 'Admin'
      }
    });

    if (!contributor) {
      console.log("not admin")
      return res.status(403).json({ message: "Only admin can delete repository" });
    }

    await repository.destroy();
    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
},

  async getPersonalRepo(req,res){
   try {
    const{user_id}=req.params;

    const repos= await Contributor.findAll({
      where:{
        user_id:user_id
      },
      include:{
        model:Repository,
       
      }
    })
    res.status(200).send({message:'Fetched succesfully',data:repos});
   } catch (error) {
    res.status(500).json({ error: error.message });
   }
  }
};

