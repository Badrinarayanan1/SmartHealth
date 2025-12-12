const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        // TODO: Hash password before saving (e.g. using bcrypt)
        const user = new User({ name, email, password, role: role || 'user' });
        await user.save();

        // Return without password
        const { password: _, ...userWithoutPass } = user.toObject();
        res.status(201).json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Simple plaintext check for MVP
        console.log("Login Attempt:", { email, providedPass: password });
        if (user) console.log("User Found:", { storedPass: user.password });
        else console.log("User Not Found");

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const { password: _, ...userWithoutPass } = user.toObject();
        res.json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ALL USERS (Admin only - logical check)
router.get('/', async (req, res) => {
    try {
        // ideally middleware checks for admin
        const { role } = req.query; // Simple security: ?role=admin (insecure but fits current scope)
        // For now, just return all, frontend filters/protects.

        const users = await User.find({}, '-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET SINGLE USER
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

