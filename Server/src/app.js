

import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import medicalTestPriceRoutes from './routes/medicalTestPrice.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import rateLimit from 'express-rate-limit';
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use(cors());
app.use(express.json());
app.use(limiter)

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-test-prices', medicalTestPriceRoutes);
app.use('/api/doctors', doctorRoutes);

export default app;