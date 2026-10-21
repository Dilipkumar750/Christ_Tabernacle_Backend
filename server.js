import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ATLAS_URI = 'mongodb+srv://dilipk5406:dilipk5406@cluster0.zhn1ypi.mongodb.net/christ_tabernacle?retryWrites=true&w=majority&appName=Cluster0';
const MONGO_URI = process.env.MONGO_URI || ATLAS_URI;

// Middleware
app.use(
  cors({
    origin: '*', // Allow requests from any frontend port or hosted domain
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// MongoDB Connection helper (cached for serverless)
let cachedDbPromise = null;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      console.log('✅ Connected to MongoDB successfully.');
      return conn;
    }).catch((err) => {
      cachedDbPromise = null;
      console.error('⚠️ MongoDB connection error:', err.message);
    });
  }
  return cachedDbPromise;
};

// Database connection middleware for incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
  next();
});

// Serve static uploaded media files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
import authRoutes from './routes/authRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import songRoutes from './routes/songRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Root status endpoint for root domain access
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'online',
    church: "Christ's Tabernacle Prayer & Worship Centre API",
    database: dbStatus,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      hero: '/api/hero',
      testimonials: '/api/testimonials',
      photos: '/api/photos',
      songs: '/api/songs',
      upload: '/api/upload',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'online',
    church: "Christ's Tabernacle Prayer & Worship Centre API",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start local listener only if not on Vercel
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🕊️  Christ's Tabernacle Backend Server Running!`);
      console.log(`🌐  API URL: http://localhost:${PORT}`);
      console.log(`📂  Uploads URL: http://localhost:${PORT}/uploads`);
      console.log(`❤️   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  });
}

export default app;
