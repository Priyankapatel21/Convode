import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true 
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [ 6, 'Email must be at least 6 characters long' ],
        maxLength: [ 50, 'Email must not be longer than 50 characters' ]
    },

    password: {
        type: String,
        select: false,
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true 
    },

    refreshToken: {
        type: String,
        select: false
    }
}, { 
   
    timestamps: true 
})

// --- Static and Instance Methods ---

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// 1. Generate short-lived Access Token (Includes username for Dashboard)
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email, 
            username: this.username // Added so Dashboard can show "Welcome, [Name]"
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}

// 2. Generate long-lived Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
}

// Backward compatibility (optional - you can remove this once you switch to AccessTokens)
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

const User = mongoose.model('user', userSchema);

export default User;