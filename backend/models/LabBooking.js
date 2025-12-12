const mongoose = require('mongoose');

const labBookingSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Optional if patient self-books? For now assume doc books.
    labTest: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    result: String // URL or text
});

module.exports = mongoose.model('LabBooking', labBookingSchema);
