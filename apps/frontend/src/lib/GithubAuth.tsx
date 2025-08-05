import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { BACKEND_URL, GITHUB_CLIENT_ID } from '../config';

// Define types for the context
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string;
  email?: string;
}

interface GitHubAuthContextType {
  isConnected: boolean;
  user: GitHubUser | null;
  loading: boolean;
  initiateAuth: () => void;
  disconnect: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const GitHubAuthContext = createContext<GitHubAuthContextType | undefined>(undefined);

// GitHub Auth Provider
export const GitHubAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/github/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIsConnected(data.connected);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateAuth = () => {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent('repo user:email');
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for CSRF protection
    sessionStorage.setItem('github_oauth_state', state);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    window.open(authUrl, '_blank');
  };

  const disconnect = async () => {
    try {
      await fetch(`${BACKEND_URL}/github/disconnect`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsConnected(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <GitHubAuthContext.Provider value={{
      isConnected,
      user,
      loading,
      initiateAuth,
      disconnect,
      checkAuthStatus
    }}>
      {children}
    </GitHubAuthContext.Provider>
  );
};

export const GitHubAuth = (): GitHubAuthContextType => {
  const context = useContext(GitHubAuthContext);
  if (!context) {
    throw new Error('useGitHubAuth must be used within GitHubAuthProvider');
  }
  return context;
};

// GitHub OAuth Callback Handler
export const GitHubCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const { checkAuthStatus } = GitHubAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('github_oauth_state');

    if (state !== storedState) {
      setStatus('error');
      return;
    }

    if (code) {
      try {
        const response = await fetch(`${BACKEND_URL}/github/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code })
        });

        if (response.ok) {
          setStatus('success');
          await checkAuthStatus();
          // Redirect to main app after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
      }
    } else {
      setStatus('error');
    }

    // Clean up state
    sessionStorage.removeItem('github_oauth_state');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'processing' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to GitHub...</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Successfully connected! Redirecting...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Connection failed. Please try again.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
  