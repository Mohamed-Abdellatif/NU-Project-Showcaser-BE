import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import projectRoutes from './routes/project.routes';
import userRoutes from './routes/userRoute';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import passport, { configurePassport } from './config/passport';
import cookieParser from 'cookie-parser';
import { jwtCookieAuth } from './middlewares/jwtCookieAuth';

dotenv.config();

const app = express();

// Configure allowed origins based on environment
const allowedOrigins = (process.env.NODE_ENV === 'production'
  ? [process.env.PRODUCTION_FRONTEND_URL]
  : process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5173']).filter((origin): origin is string => !!origin);

// Middleware
// Configure Helmet with frontend-friendly settings
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", ...allowedOrigins] // Add all allowed origins to CSP
    }
  },
  crossOriginEmbedderPolicy: false, // Allows loading resources from different origins
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configure CORS for frontend
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session and Passport
const sessionSecret = process.env.SESSION_SECRET || 'keyboard cat';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());
// Attach user from JWT cookie (if present)
app.use(jwtCookieAuth);

// Use routes
app.use('/project', projectRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
