import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import driverProfileRoutes from './routes/driverProfileRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/driver/profile', driverProfileRoutes);

connectDB()
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
    })
    .catch(err => console.error("DB connection failed:", err));
