export interface Repository {
  repo_id: number;
  creator_id: number;
  repo_name: string;
  description: string;
  visibility: 'Public' | 'Private';
  creation_date: string;
  stars?: number ;
  forks?: number;
  watchers?:number;
  license?:string
  language?:string
  languageColor?:string
  tags?:string[]
}

export interface File {
  file_id: number;
  commit_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface Branch {
  branch_id: number;
  repo_id: number;
  name: string;
  creator_id: number;
  created_at: string;
  last_commit_id: number;
  parent_branch_id: number | null;
  base_commit_id: number | null;
}

export interface Contributor_stat {
  user_id: number;
  username: string;
  fullName: string;
  avatar?: string;
  role: string;
  profile_url: string;
  contributions: number;
  branches_created: number;
  firstContribution: string | null;
  last_contribution: string | null;
  joinedAt: string;
  recent_commits: {
    id: number;
    message: string;
    timestamp: string;
  }[];
}


export interface ContributerDetails{
  repo_id:number,
  user_id:number,
  role:string
}

export interface Commit {
  commit_id: number;
  commit_message: string;
  creator_id: number;
  commit_timestamp: string;
  branch_id:number
}


export interface Issue{
  issue_id:string;
  repo_id:string;
  creator_id?:string;
  issue_title:string;
  issue_description:string;
  status:string;
  assignee_id:string;
  creation_date:string;
  labels:string[];
}