import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import workflowRoutes from './routes/workflow';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow multiple origins or just standard Vite port for dev
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'super-secret-key-dev',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day session
  }
}));

app.use('/api/workflows', workflowRoutes);

// General auth endpoint to show session persistence w/o mandatory auth
app.get('/api/auth/me', (req, res) => {
  // If we had a real user logged in, we'd return them. Right now, return session ID as pseudo-user
  res.json({
    user: {
      id: req.session.id,
      email: `guest-${req.session.id.substring(0, 5)}@guest.local`,
      name: `Guest ${req.session.id.substring(0, 5)}`,
      role: 'guest'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
