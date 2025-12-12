const express = require('express');
const router = express.Router();
const LabTest = require('../models/LabTest');

// GET all tests
router.get('/', async (req, res) => {
    try {
        const tests = await LabTest.find();
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD a test (Admin)
router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const test = new LabTest({ name, description, price });
        await test.save();
        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BOOK a test
const LabBooking = require('../models/LabBooking');
router.post('/book', async (req, res) => {
    try {
        const { patient, doctor, labTest } = req.body;
        const booking = new LabBooking({ patient, doctor, labTest });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Bookings by Patient
router.get('/bookings/:patientId', async (req, res) => {
    try {
        const bookings = await LabBooking.find({ patient: req.params.patientId })
            .populate('labTest')
            .populate('doctor', 'name')
            .sort({ date: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
