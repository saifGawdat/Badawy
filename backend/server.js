const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;
app.disable("x-powered-by");

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MonogDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/before-after', require('./routes/beforeAfterRoutes'));
app.use('/api/hero-slides', require('./routes/heroSlideRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/site-settings', require('./routes/siteSettingsRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));

// Error Middleware
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
