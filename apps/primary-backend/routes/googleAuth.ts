import dotenv from 'dotenv';
import bcrypt from "bcrypt";

dotenv.config();

import prisma from '@repo/db/client';
import { Router, type Request, type Response } from 'express';
import passport,  {type Profile}  from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import jwt from 'jsonwebtoken';

const GoogleRouter: Router = Router();


GoogleRouter.use(session({
    secret: process.env.JWT_SECRET || "1234secret",
    resave: false,
    saveUninitialized: true,
}));

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
                ImageUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
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
    failureRedirect: '/auth/failure'
  }),
  (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const token = jwt.sign({ 
        userId: (req.user as any).id, 
        name: (req.user as any).name 
      }, process.env.JWT_SECRET!, { expiresIn: '3h' });

      res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    } else {
      res.redirect('http://localhost:5173/auth/failure');
    }
  }
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