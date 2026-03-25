import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import userModel from "../models/user.model.js"; 

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // FETCH FROM DB: This ensures req.user has the 'username' 
        // even if it wasn't in the original token payload.
        const user = await userModel.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.log("Auth Middleware Error:", error.message);
        res.status(401).send({ error: 'Unauthorized User' });
    }
}