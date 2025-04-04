export interface Repository {
  repo_id: number;
  creator_id: number;
  repo_name: string;
  description: string;
  visibility: 'Public' | 'Private';
  creation_date: string;
  stars?: number ;
  forks?: number;
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

export interface Contributor {
  user_id: number;
  username: string;
  email: string;
  role: 'Admin' | 'Contributor';
  avatar?: string;
}

export interface Commit {
  commit_id: number;
  commit_message: string;
  creator_id: number;
  commit_timestamp: string;
  branch_id:number
}