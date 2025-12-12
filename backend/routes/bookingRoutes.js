const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// CREATE Booking (Atomic)
router.post('/', async (req, res) => {
    // Start a session for multi-document transaction (Optional for single doc atomic, but good practice if extending)
    // For this assessment "Prevent Overbooking" -> Atomic Update on Doctor Slot is Key.

    try {
        const { doctorId, slotTime, userId, symptoms } = req.body;

        // 1. Helper to parse date
        const targetTime = new Date(slotTime);

        // 2. ATOMIC CHECK & UPDATE
        // We look for a doctor with this ID, having a slot at this time that is NOT booked.
        // We atomically set isBooked to true.
        const doctor = await Doctor.findOneAndUpdate(
            {
                _id: doctorId,
                slots: {
                    $elemMatch: {
                        time: targetTime,
                        isBooked: false
                    }
                }
            },
            {
                $set: { "slots.$.isBooked": true, "slots.$.bookedBy": userId }
            },
            { new: true } // Return updated doc
        );

        if (!doctor) {
            // If null, it means either doctor doesn't exist OR slot is already booked (condition failed)
            return res.status(409).json({
                status: "FAILED",
                message: "Slot already booked or unavailable."
            });
        }

        // 3. Create Booking Record (Post-reservation)
        // Even if this fails, the slot is reserved. We might want to rollback if this part fails 
        // (that's where transactions come in), but for MVP Atomic Slot Reservation is the critical part.
        const booking = new Booking({
            user: userId,
            doctor: doctorId,
            slotTime: targetTime,
            status: 'CONFIRMED',
            symptoms
        });

        await booking.save();

        res.json({ status: "CONFIRMED", bookingId: booking._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET My Bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
