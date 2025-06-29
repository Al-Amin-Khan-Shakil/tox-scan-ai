import express from 'express';
     import cors from 'cors';
     import helmet from 'helmet';
     import compression from 'compression';
     import dotenv from 'dotenv';
     import path from 'path';
     import { fileURLToPath } from 'url';

     // Route imports
     import authRoutes from './routes/auth.js';
     import analysisRoutes from './routes/analysis.js';

     // Database
     import { initDatabase } from './database/init.js';

     dotenv.config();

     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);

     const app = express();
     const PORT = process.env.PORT || 3001;

     // Serve static files from the Vite build output (must come before other routes)
     app.use(express.static(path.join(__dirname, '../dist')));

     // Security middleware
     app.use(helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           styleSrc: ["'self'", "'unsafe-inline'"],
           scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
           imgSrc: ["'self'", "data:", "blob:", "https:"],
           connectSrc: ["'self'", "https://generativelanguage.googleapis.com", process.env.FRONTEND_URL || "https://toxscan-ai.onrender.com"],
           workerSrc: ["'self'", "blob:"],
           manifestSrc: ["'self'"]
         }
       },
       crossOriginResourcePolicy: { policy: 'cross-origin' }
     }));

     app.use(cors({
       origin: process.env.NODE_ENV === 'production'
         ? process.env.FRONTEND_URL || 'https://toxscan-ai.onrender.com'
         : ['http://localhost:5173', 'http://localhost:3000'],
       credentials: true
     }));

     app.use(compression());
     app.use(express.json({ limit: '10mb' }));
     app.use(express.urlencoded({ extended: true, limit: '10mb' }));

     // Serve uploaded files
     app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

     // Serve manifest.json explicitly
     app.get('/manifest.json', (req, res) => {
       res.setHeader('Content-Type', 'application/manifest+json');
       res.sendFile(path.join(__dirname, '../dist', 'manifest.json'));
     });

     // API Routes
     app.use('/api/auth', authRoutes);
     app.use('/api/analysis', analysisRoutes);

     // Health check
     app.get('/api/health', (req, res) => {
       res.json({ status: 'OK', timestamp: new Date().toISOString() });
     });

     // Serve index.html for all unmatched routes (exclude static assets)
     app.get('*', (req, res, next) => {
       if (req.path.startsWith('/m-logo.png') || req.path.startsWith('/sw.js')) {
         return next(); // Skip wildcard for specific static files
       }
       res.sendFile(path.join(__dirname, '../dist', 'index.html'));
     });

     // Error handling middleware
     app.use((err, req, res, next) => {
       console.error('Error:', err);
       res.status(err.status || 500).json({
         message: err.message || 'Internal server error',
         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
       });
     });

     // Initialize database and start server
     const startServer = async () => {
       try {
         await initDatabase();
         console.log('✅ Database initialized successfully');

         app.listen(PORT, () => {
           console.log(`🚀 Server running on port ${PORT}`);
           console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
         });
       } catch (error) {
         console.error('❌ Failed to start server:', error);
         process.exit(1);
       }
     };

     startServer();