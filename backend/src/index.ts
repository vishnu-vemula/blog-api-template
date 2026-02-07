import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Import routes
import { userRoutes } from './features/users/index.js';
import { blogRoutes } from './features/blogs/index.js';
import { categoryRoutes } from './features/categories/index.js';
import { commentRoutes } from './features/comments/index.js';
import { likeRoutes } from './features/likes/index.js';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';

const app: Application = express();

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'epic_blog_db';
const CORS_ORIGINS = process.env.CORS_ORIGINS || '*';

// Middleware
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGINS === '*' ? '*' : CORS_ORIGINS.split(','),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Epic Blog API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes - All prefixed with /api
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// Root endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Epic Blog API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        deleteAccount: 'DELETE /api/users/profile',
        changePassword: 'PUT /api/users/change-password',
        getAllUsers: 'GET /api/users',
        getUserById: 'GET /api/users/:userId',
      },
      blogs: {
        create: 'POST /api/blogs',
        getAll: 'GET /api/blogs',
        getById: 'GET /api/blogs/:blogId',
        getBySlug: 'GET /api/blogs/slug/:slug',
        getByAuthor: 'GET /api/blogs/author/:authorId',
        getByTag: 'GET /api/blogs/tag/:tag',
        getPopular: 'GET /api/blogs/popular',
        getMyBlogs: 'GET /api/blogs/user/my-blogs',
        update: 'PUT /api/blogs/:blogId',
        delete: 'DELETE /api/blogs/:blogId',
        publish: 'POST /api/blogs/:blogId/publish',
        unpublish: 'POST /api/blogs/:blogId/unpublish',
      },
      categories: {
        create: 'POST /api/categories',
        getAll: 'GET /api/categories',
        getById: 'GET /api/categories/:categoryId',
        getBySlug: 'GET /api/categories/slug/:slug',
        getTree: 'GET /api/categories/tree',
        update: 'PUT /api/categories/:categoryId',
        delete: 'DELETE /api/categories/:categoryId',
      },
      comments: {
        create: 'POST /api/comments',
        getByBlog: 'GET /api/comments/blog/:blogId',
        getByAuthor: 'GET /api/comments/author/:authorId',
        getById: 'GET /api/comments/:commentId',
        update: 'PUT /api/comments/:commentId',
        delete: 'DELETE /api/comments/:commentId',
      },
      likes: {
        toggle: 'POST /api/likes/toggle',
        getStatus: 'GET /api/likes/status/:targetType/:targetId',
        getTargetLikers: 'GET /api/likes/target/:targetType/:targetId',
        getMyLikes: 'GET /api/likes/my-likes',
      },
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Epic Blog API is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

export default app;
