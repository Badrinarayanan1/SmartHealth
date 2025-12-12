const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// POST: Create prescription
router.post('/', async (req, res) => {
    try {
        const { doctor, patient, medicines, notes } = req.body;
        const prescription = new Prescription({ doctor, patient, medicines, notes });
        await prescription.save();
        res.status(201).json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: By Patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId })
            .populate('doctor', 'name specialization')
            .sort({ date: -1 });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
