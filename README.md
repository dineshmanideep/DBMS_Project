# DBMS_Project

- technologies
 - frontend: React.js(use state management of react itself),vite,tailwindcss,typescript
 - backend: Node.js, Express.js, MySQL,sequelize
 - database: MySQL

- Pages
 - Signup Page (/register)
    -unique username ,email and password
    -full name
 - login page (/login)
    -username and password
    -login button
 - home page (/)
  - create repository button
 - profile (/:username)
    - profile picture
    - full name
    - email
    - edit profile button
 - repository (/:username/:repo_id/main)
   - list of all files
   - add file button

 - repository settings (/:username/:repo_id/settings)
    -only admin can access this page
   - delete repository button
   - add contributor button
   - remove contributor button
   - change role of contributor button
   - change visibility of repository button (public/private)
   - list of all contributors with their roles and a button to change their role

 - list of all branches (/:username/:repo_id/branches)
 - branch (/:username/:repo_id/:branch_name)
   - list of all files in that particular branch
    - add file button
    - same features are available as in main branch
    - list of all commits in that branch
    
 - file (/:username/:repo_id/:branch_name/:file_name)
    - file content
    - download button
    - edit button
    - add comment button
    - list of all comments visible on click of history button in this page
 - pull request (/:username/:repo_name/:branch_name/pull_request)
   - for any branch the same list 
   - but fro all branches execpt main it show a button to create a pull request
   - any person can view the pull request but only the admin can accept  
   -pull request are made to other branches to main branch




## Schema
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Repositories (
    repo_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT,
    repo_name VARCHAR(255) NOT NULL,
    description TEXT,
    visibility VARCHAR(50) DEFAULT 'Public',
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    repo_id INT,
    name VARCHAR(255) NOT NULL,
    creator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_commit_id INT, 
    parent_branch_id INT, 
    base_commit_id INT,
    FOREIGN KEY (repo_id) REFERENCES Repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_branch_id) REFERENCES Branches(branch_id) ON DELETE SET NULL,
    FOREIGN KEY (base_commit_id) REFERENCES Commits(commit_id) ON DELETE SET NULL
    FOREIGN KEY (last_commit_id) REFERENCES Commits(commit_id) ON DELETE SET NULL
);

CREATE TABLE Commits (
    commit_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    creator_id INT,
    commit_message TEXT,
    commit_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    commit_id INT,  
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    file_content LONGBLOB NOT NULL,  
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commit_id) REFERENCES Commits(commit_id) ON DELETE CASCADE
);

CREATE TABLE Pull_Requests (
    pr_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT,
    pr_title VARCHAR(255),
    pr_description TEXT,
    pr_status VARCHAR(50) DEFAULT 'Open',
    base_branch_id INT,
    target_branch_id INT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (base_branch_id) REFERENCES Branches(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (target_branch_id) REFERENCES Branches(branch_id) ON DELETE CASCADE
);


CREATE TABLE Pull_Request_Reviews (
    pr_id INT,
    reviewer_id INT,
    review_comments TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pr_id, reviewer_id),
    FOREIGN KEY (pr_id) REFERENCES Pull_Requests(pr_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Issues (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    repo_id INT,
    creator_id INT,
    issue_title VARCHAR(255),
    issue_description TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    assignee_id INT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repo_id) REFERENCES Repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES Users(user_id) ON DELETE SET NULL
);
CREATE TABLE Contributors (
    repo_id INT,
    user_id INT,
    role VARCHAR(50) DEFAULT 'Contributor', //can be admin or contributor
    PRIMARY KEY (repo_id, user_id), 
    FOREIGN KEY (repo_id) REFERENCES Repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);