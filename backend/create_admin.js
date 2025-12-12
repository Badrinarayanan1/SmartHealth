require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log("Usage: node create_admin.js <email> <password> <name>");
        process.exit(1);
    }

    const [email, password, name] = args;

    await connectDB();

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            console.log("User already exists. Updating role to admin...");
            existing.role = 'admin';
            existing.password = password; // Optional: update password
            await existing.save();
            console.log("User updated to Admin successfully.");
        } else {
            const admin = new User({
                name,
                email,
                password,
                role: 'admin'
            });
            await admin.save();
            console.log("Admin created successfully.");
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();
