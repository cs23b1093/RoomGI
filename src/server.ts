import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { logger } from './utils/index.js';
import { errorHandler } from './middleware/index.js';
import pool from './config/database.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

pool.connect()
    .then(() => logger.info('Connected to PostgreSQL'))
    .catch((err) => logger.error('PostgreSQL connection error:', err));

// Basic route
app.get('/', (_req, res) => {
  res.json({ message: 'Hello from TypeScript server!' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});