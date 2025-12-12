const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET all doctors (with optional ?department filter)
router.get('/', async (req, res) => {
    try {
        const { department } = req.query;
        let query = {};
        if (department) {
            query.specialization = department;
        }
        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Add a new doctor
router.post('/', async (req, res) => {
    try {
        const { name, specialization, bio, slots, email, password } = req.body;

        // 1. Create User account for the doctor
        const User = require('../models/User');
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const newUser = new User({
            name,
            email,
            password: password || 'password123', // Default if not provided
            role: 'doctor'
        });
        await newUser.save();

        // 2. Create Doctor profile linked to User
        const newDoctor = new Doctor({
            name,
            specialization,
            bio,
            slots,
            user: newUser._id,
            email
        });
        await newDoctor.save();

        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Add slots to a doctor
router.post('/:id/slots', async (req, res) => {
    try {
        const { time } = req.body; // Expect ISO date string
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        doctor.slots.push({ time: new Date(time), isBooked: false });
        await doctor.save();
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Delete a slot
router.delete('/:id/slots/:slotId', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        doctor.slots = doctor.slots.filter(slot => slot._id.toString() !== req.params.slotId);
        await doctor.save();
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Delete a doctor
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });
        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
