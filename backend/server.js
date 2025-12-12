require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

app.use('/api/triage', require('./routes/triageRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/book', require('./routes/bookingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/labs', require('./routes/labRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));

app.get('/', (req, res) => {
    res.send('SmartCare API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
