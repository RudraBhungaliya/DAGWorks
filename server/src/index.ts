import express from 'express';
import session from 'express-session';
import { RedisStore } from "connect-redis";
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import { connectRedis, redisClient } from './config/redis';

import authRoutes from './modules/auth/auth.routes';
import workflowRoutes from './modules/workflow/workflow.routes';
import integrationRoutes from './modules/integrations/integration.routes';
import logRoutes from './modules/logs/log.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB and Redis
connectDB();
connectRedis();

// Initialize store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "dagworks:",
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'super-secret-key-dev',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day session
  }
}));

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', nodes: [], edges: [], timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
