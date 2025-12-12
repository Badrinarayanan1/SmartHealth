const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Patient ID (ObjectId or Guest String)
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slotTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'],
        default: 'PENDING'
    },
    symptoms: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
