const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// POST: Create Bill
router.post('/', async (req, res) => {
    try {
        const { patient, doctor, type, description, amount, status } = req.body;
        const bill = new Bill({ patient, doctor, type, description, amount, status });
        await bill.save();
        res.status(201).json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: By Patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const bills = await Bill.find({ patient: req.params.patientId })
            .sort({ date: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
