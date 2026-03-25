import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';
import jwt from 'jsonwebtoken';

// Helper for consistent cookie options across production and local
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on Render/Vercel, false on localhost
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-site
    maxAge: 3600000 // 1 hour
};

export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);

        const token = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        // SET SECURE COOKIE
        res.cookie('token', token, cookieOptions);

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        res.status(201).json({ user: userResponse, token, refreshToken });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ errors: 'Invalid credentials' });
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({ errors: 'Invalid credentials' });
        }

        const token = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        // SET SECURE COOKIE
        res.cookie('token', token, cookieOptions);

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        res.status(200).json({ user: userResponse, token, refreshToken });

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid Refresh Token" });
        }

        const accessToken = user.generateAccessToken();

        // Refresh the cookie with the new Access Token
        res.cookie('token', accessToken, cookieOptions);

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(401).json({ message: "Token expired or invalid" });
    }
}

export const profileController = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.decode(token);
            if (decoded) {
                await userModel.findOneAndUpdate({ email: decoded.email }, { refreshToken: null });
            }
            // Blacklist the access token in Redis
            redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        }

        // CLEAR THE COOKIE
        res.clearCookie('token', {
            ...cookieOptions,
            maxAge: 0 // Expire immediately
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({ users: allUsers });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}