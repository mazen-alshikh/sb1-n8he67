import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from './config/database.js';
import { QuranService } from './services/quranService.js';
import { authMiddleware } from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { resourceRoutes } from './routes/resources.js';
import { searchRoutes } from './routes/search.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Initialize database and load Quran dataset
async function initialize() {
  try {
    await initializeDatabase();
    await QuranService.initializeDataset();
    console.log('Database and Quran dataset initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', authMiddleware, resourceRoutes);
app.use('/api/search', searchRoutes);

initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});