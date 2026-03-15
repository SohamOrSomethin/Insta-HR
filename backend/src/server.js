require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

/* ------------------ CREATE UPLOADS DIR ------------------ */
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const emailService = require('./services/email/emailService');
require('./models/index');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const candidateRoutes = require('./routes/candidate.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const trainingRoutes = require('./routes/training.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

/* ------------------ SECURITY ------------------ */
app.disable('x-powered-by');
app.use(helmet());

// Allow multiple origins: Vercel URL + localhost for dev
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

/* ------------------ RATE LIMITING ------------------ */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});

/* ------------------ SWAGGER ------------------ */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'InstaHire API', version: '1.0.0', description: 'AI-Powered Job Portal API Documentation' },
    servers: [{ url: process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5000', description: 'API server' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background: linear-gradient(135deg, #2563eb, #9333ea); }',
  customSiteTitle: 'InstaHire API Docs'
}));

app.use('/api/', apiLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

/* ------------------ MIDDLEWARE ------------------ */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ STATIC FILES ------------------ */
app.use('/uploads', express.static(uploadsDir));

/* ------------------ ROUTES ------------------ */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/training', trainingRoutes);
app.use('/api/v1/ai', require('./routes/aiScreening.routes'));
app.use('/api/v1/jobs-actions', require('./routes/savedJobs.routes'));
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/employer', require('./routes/employer.routes'));
app.use('/api/v1/employers', require('./routes/employer.routes'));
app.use('/api/v1/admin', adminRoutes);

/* ------------------ HEALTH CHECK ------------------ */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'InstaHire API is running 🚀',
    db: sequelize ? 'configured' : 'not configured',
    env: process.env.NODE_ENV || 'development'
  });
});

/* ------------------ 404 HANDLER ------------------ */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ------------------ GLOBAL ERROR HANDLER ------------------ */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD env vars on Railway');
    // Do NOT exit - let server start so Railway doesnt 502
    // DB-dependent routes will fail gracefully
  }

  // Always sync models (will fail gracefully if DB is down)
  try {
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced');
  } catch (e) {
    console.error('❌ Model sync failed:', e.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 FRONTEND_URL: ${FRONTEND_URL}`);
    console.log(`📖 API Docs: http://localhost:${PORT}/api-docs`);
  });
}

startServer();
