import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      login: string;
      name: string;
      email: string;
      avatar_url: string;
    };
    githubToken?: string;
  }
} 