const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
const Profile = require("../models/Profile");

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'kean_acm' });
        console.log("MongoDB Connected");

        // details
        const email = "admin@kean.edu";
        const password = "1234567890";

        // Check if exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        // Create Profile (Member)
        const profile = await Profile.create({
            name: "Admin User",
            position: "President", // Must be in enum
            Member: "Executive Board" // Must be in enum, Role
        });

        console.log("Profile Created:", profile._id);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            email,
            password: hashedPassword,
            memberId: profile._id
        });

        console.log("Admin User Created Successfully");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
