const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    email: { type: String, required: true }, // Redundant but useful for display/search
    specialization: { type: String, required: true }, // e.g., Cardiology, Orthopedics
    bio: String,
    slots: [{
        time: { type: Date, required: true },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: String, default: null },
        lockedUntil: { type: Date, default: null } // For temporary reservation (optional improvement)
    }]
});

// Index to find doctors by specialization quickly
doctorSchema.index({ specialization: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
