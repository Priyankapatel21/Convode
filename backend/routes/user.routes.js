import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import passport from 'passport';
import '../services/auth.service.js'; // Ensure the passport strategy is initialized

const router = Router();

// --- Existing Routes ---

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController);

router.get('/profile', authMiddleware.authUser, userController.profileController);

router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


// --- New Refresh Token Route ---

router.post('/refresh-token', userController.refreshTokenController);


// --- New Google OAuth Routes ---

// 1. Trigger Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback (Handles the response from Google)
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        try {
            // Generate tokens for the user found/created by passport
            const accessToken = req.user.generateAccessToken();
            const refreshToken = req.user.generateRefreshToken();

            // Save refresh token to DB
            req.user.refreshToken = refreshToken;
            await req.user.save();

            // Redirect to frontend with tokens in URL
            // Adjust the URL to your frontend's "Login Success" handler
            const frontendUrl = process.env.NODE_ENV === 'production' 
                ? 'https://convode.vercel.app' 
                : 'http://localhost:5173';

            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 3600000 // 1 hour
            });

            res.redirect(`${frontendUrl}/dashboard?token=${accessToken}&refreshToken=${refreshToken}`);
            
        } catch (error) {
            console.error("OAuth Callback Error:", error);
            const errorUrl = process.env.NODE_ENV === 'production' 
                ? 'https://convode.vercel.app/login?error=auth_failed' 
                : 'http://localhost:5173/login?error=auth_failed';
            res.redirect(errorUrl);
        }
    }
);

export default router;