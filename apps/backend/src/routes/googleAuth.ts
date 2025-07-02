import path from 'path';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

import prisma from '@repo/db/client';
import { Router, Request, Response } from 'express';
import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config';

const GoogleRouter: Router = Router();


GoogleRouter.use(session({
    secret: process.env.JWT_SECRET || "1234secret",
}));

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID || "",
    clientSecret: GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    passReqToCallback: true
}, async (req: Request, accessToken: string, refreshToken: string, params: any, profile: Profile, done: any) => {
  try {
    if (!profile.id || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
        return done(new Error('Invalid profile data from Google'));
    }

    let user = await prisma.user.findFirst({
        where: {
            id: profile.id
        }
    });
    
    if (!user) {
        // Create new user
        user = await prisma.user.create({
            data: {
                id: profile.id,
                name: profile.displayName || '',
                email: profile.emails[0].value,
                password: await bcrypt.hash(accessToken, 10),
            }
        });
    }

    return done(null, user);
  } catch (error) {
      console.error('Error during Google OAuth authentication:', error);
      return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Initiate Google OAuth
GoogleRouter.get('/', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
GoogleRouter.get('/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/failure',
    successRedirect: 'http://localhost:5173' 
  })
);

// OAuth success handler (alternative to successRedirect)
GoogleRouter.get('/success', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: (req.user as any)._id,
        name: (req.user as any).name,
        email: (req.user as any).email,
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

// OAuth failure handler
GoogleRouter.get('/failure', (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    message: 'Google authentication failed'
  });
});

// Check authentication status
GoogleRouter.get('/status', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: (req.user as any)._id,
        name: (req.user as any).name,
        email: (req.user as any).email,
        picture: (req.user as any).picture
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

export default GoogleRouter;