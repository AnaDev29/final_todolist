import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { sequelize } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import userRoutes from './src/routes/user.routes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// CORS configuration - Permitir múltiples orígenes en desarrollo
app.use(cors({
  origin: true, 
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (crea las tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

export default app;
