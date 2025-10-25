import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import projectRoutes from './routes/project.routes';

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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/project', projectRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
