const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    medicines: [{
        name: { type: String, required: true },
        dosage: String,
        frequency: String,
        duration: String
    }],
    notes: String
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
