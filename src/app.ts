import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import schoolRoutes from './routes/schoolRoutes';
import courseRoutes from './routes/courseRoutes';
import commentRoutes from './routes/commentRoutes';
import suggestionRoutes from './routes/suggestionRoutes';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import notifyRoutes from './routes/notifyRoutes';
import adminRoutes from './routes/Admin/adminRoutes'
import passport, { configurePassport } from './config/passport';
import cookieParser from 'cookie-parser';
import { jwtCookieAuth } from './middlewares/jwtCookieAuth';
import { originGuard } from './middlewares/originGuard';

dotenv.config();

const app = express();

// Heroku / reverse proxies must be trusted so secure cookies are sent correctly
// and req.secure is set based on X-Forwarded-Proto.
app.set('trust proxy', 1);

// Configure allowed origins based on environment
const allowedOrigins = (process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URLS?.split(',') || []
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

const sessionOptions: session.SessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

// Use a persistent store in production (no in-memory sessions on Heroku)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in production for session storage');
  }
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  });
}

app.use(session(sessionOptions));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());
// Attach user from JWT cookie (if present)
app.use(jwtCookieAuth);

// Block direct browser access - only allow requests from frontend domains
app.use(originGuard);

// Use routes
app.use('/project', projectRoutes);
app.use('/user', userRoutes);
app.use('/school', schoolRoutes);
app.use('/course', courseRoutes);
app.use('/comment', commentRoutes);
app.use('/suggestion', suggestionRoutes);
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/notify', notifyRoutes);
app.use('/admin',adminRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
