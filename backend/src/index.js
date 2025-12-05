import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import driverApplicationRoutes from './routes/driverApplicationRoutes.js';
import driverProfileRoutes from './routes/driverProfileRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import studentVerificationRoutes from './routes/studentVerificationRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/driver/profile', driverProfileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/student-verification', studentVerificationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/driver-application', driverApplicationRoutes);

connectDB()
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
    })
    .catch(err => console.error("DB connection failed:", err));
