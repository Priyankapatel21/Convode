import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import './services/auth.service.js';

connect();

const app = express();

// 1. SECURITY HEADERS (MUST BE BEFORE ROUTES)
app.use((req, res, next) => {
    // This allows the popup/redirect from Google to work without being blocked by the browser
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); 
    res.header("Cross-Origin-Embedder-Policy", "require-corp"); // Or remove if not using SharedArrayBuffer
    next();
});

// 2. CORS CONFIG
app.use(cors({
    origin: 'https://convode.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. PASSPORT
app.use(passport.initialize()); 

// 4. ROUTES
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use("/ai", aiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;