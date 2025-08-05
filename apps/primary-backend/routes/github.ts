require('dotenv').config();
import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const GithubRouter = Router();

const generateJWT = (payload: any): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
  
const verifyJWT = (token: string): any => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return null;
    }
};

const authenticateGitHub = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const token = req.cookies.github_auth_token;
        
        if (!token) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
    
        const decoded = verifyJWT(token);
        if (!decoded) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
  
        // Verify token is still valid with GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${decoded.access_token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    
        req.user = {
            id: userResponse.data.id,
            login: userResponse.data.login,
            name: userResponse.data.name,
            email: userResponse.data.email || '',
            avatar_url: userResponse.data.avatar_url
        } as GitHubUser;
        req.githubToken = decoded.access_token;
        next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
};

interface GitHubUser {
    id: number;
    login: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface GitHubTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
}

interface AuthenticatedRequest extends Request {
    user?: GitHubUser;
    githubToken?: string;
}

interface ProjectFile {
    path: string;
    content: string;
}
  
interface CreateRepoRequest {
    name: string;
    description?: string;
    files: ProjectFile[];
    private?: boolean;
}
  
interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    clone_url: string;
    owner: {
      login: string;
    };
}

GithubRouter.get('/status', async (req, res) => {
    try {
      const token = req.cookies.github_auth_token;
      
      if (!token) {
        res.json({ connected: false });
        return;
      }
  
      const decoded = verifyJWT(token);
      if (!decoded) {
        res.json({ connected: false });
        return;
      }
  
      // Verify with GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${decoded.access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
  
      res.json({
        connected: true,
        user: {
          id: userResponse.data.id,
          login: userResponse.data.login,
          name: userResponse.data.name,
          avatar_url: userResponse.data.avatar_url
        }
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.json({ connected: false });
    }
});
  
GithubRouter.post('/callback', async (req, res) => {
    try {
      const { code } = req.body;
  
      if (!code) {
        res.status(400).json({ error: 'Authorization code required' });
        return;
      }
  
      // Exchange code for access token
      const tokenResponse = await axios.post<GitHubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
  
      const { access_token } = tokenResponse.data;
  
      if (!access_token) {
        res.status(400).json({ error: 'Failed to obtain access token' });
        return;
      }
  
      // Get user information
      const userResponse = await axios.get<GitHubUser>('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
  
      // Create JWT with GitHub token
      const jwtToken = generateJWT({
        access_token,
        user_id: userResponse.data.id,
        login: userResponse.data.login
      });
  
      // Set secure HTTP-only cookie
      res.cookie('github_auth_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      res.json({ 
        success: true,
        user: {
          id: userResponse.data.id,
          login: userResponse.data.login,
          name: userResponse.data.name,
          avatar_url: userResponse.data.avatar_url
        }
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (axios.isAxiosError(error)) {
        res.status(400).json({ 
          error: 'GitHub authentication failed',
          details: error.response?.data 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
});
  
// Disconnect GitHub account
GithubRouter.post('/disconnect', (req, res) => {
    res.clearCookie('github_auth_token');
    res.json({ success: true });
});
  
GithubRouter.post('/create-repo', authenticateGitHub, async (req, res) => {
    try {
        const { name, description, files, private: isPrivate = false }: CreateRepoRequest = req.body;
    
        if (!name || !files || !Array.isArray(files)) {
            res.status(400).json({ error: 'Repository name and files are required' });
            return;
        }
    
        const githubToken = req.githubToken!;
        const user = req.user!;
    
        // Create repository
        const repoResponse = await axios.post<GitHubRepo>(
            'https://api.github.com/user/repos',
            {
                name,
                description: description || `Exported project: ${name}`,
                private: isPrivate,
                auto_init: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
  
      const repo = repoResponse.data;
  
      // Upload files to repository
      const uploadPromises = files.map(async (file: ProjectFile) => {
        try {
          const content = Buffer.from(file.content, 'utf8').toString('base64');
          
          await axios.put(
            `https://api.github.com/repos/${user.login}/${repo.name}/contents/${file.path}`,
            {
              message: `Add ${file.path}`,
              content: content,
              branch: 'main'
            },
            {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );
        } catch (error) {
          console.error(`Failed to upload ${file.path}:`, error);
          throw new Error(`Failed to upload ${file.path}`);
        }
      });
  
      await Promise.all(uploadPromises);
  
      // Create initial commit if no files were uploaded yet
      if (files.length === 0) {
        await axios.put(
          `https://api.github.com/repos/${user.login}/${repo.name}/contents/README.md`,
          {
            message: 'Initial commit',
            content: Buffer.from(`# ${name}\n\n${description || 'Exported project'}`, 'utf8').toString('base64')
          },
          {
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
      }
  
      res.json({
        success: true,
        repository: {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          clone_url: repo.clone_url
        },
        repoUrl: repo.html_url
      });
  
    } catch (error) {
      console.error('Create repo error:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to create repository';
        
        if (status === 422 && message.includes('name already exists')) {
          res.status(409).json({ error: 'Repository name already exists' });
        } else if (status === 403) {
          res.status(403).json({ error: 'Insufficient permissions. Please reconnect your GitHub account.' });
        } else {
          res.status(status).json({ error: message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
});
  
GithubRouter.get('/repos', authenticateGitHub, async (req, res) => {
    try {
      const githubToken = req.githubToken!;
      
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          per_page: 50
        }
      });
  
      const repos = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        private: repo.private,
        updated_at: repo.updated_at
      }));
  
      res.json({ repos });
    } catch (error) {
      console.error('Get repos error:', error);
      res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});
  
// Update existing repository
GithubRouter.put('/repos/:owner/:repo/update', authenticateGitHub, async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { files, commitMessage = 'Update from app' }: { files: ProjectFile[], commitMessage?: string } = req.body;
  
      if (!files || !Array.isArray(files)) {
        res.status(400).json({ error: 'Files array is required' });
        return;
      }
  
      const githubToken = req.githubToken!;
  
      // Update files in repository
      const updatePromises = files.map(async (file: ProjectFile) => {
        try {
          // Get current file SHA if it exists
          let sha: string | undefined;
          try {
            const existingFile = await axios.get(
              `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
              {
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              }
            );
            sha = existingFile.data.sha;
          } catch (error) {
            // File doesn't exist, will create new
          }
  
          const content = Buffer.from(file.content, 'utf8').toString('base64');
          
          const payload: any = {
            message: commitMessage,
            content: content,
            branch: 'main'
          };
  
          if (sha) {
            payload.sha = sha;
          }
  
          await axios.put(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );
        } catch (error) {
          console.error(`Failed to update ${file.path}:`, error);
          throw new Error(`Failed to update ${file.path}`);
        }
      });
  
      await Promise.all(updatePromises);
  
      res.json({
        success: true,
        message: 'Repository updated successfully',
        repoUrl: `https://github.com/${owner}/${repo}`
      });
  
    } catch (error) {
      console.error('Update repo error:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to update repository';
        res.status(status).json({ error: message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
});

export default GithubRouter;