const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Provide explicit path to .env since we are in src/scripts
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkModels = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'kean_acm' });
        console.log("Connected.");

        console.log("Loading models...");
        // Manually require the files to simulate application startup
        const User = require('../models/UserSchema');
        const Profile = require('../models/Profile');

        console.log("Registered Models:", mongoose.modelNames());

        console.log("Checking User Schema Paths:");
        const memberIdPath = User.schema.paths.memberId;
        console.log("User.memberId ref:", memberIdPath.options.ref);

        if (memberIdPath.options.ref !== 'Profile') {
            console.error("MISMATCH: User ref is", memberIdPath.options.reference, "but expected 'Profile'");
        }

        console.log("Testing Population...");
        const user = await User.findOne({ email: 'admin@kean.edu' });
        if (user) {
            console.log("Found User ID:", user._id);
            console.log("User memberId:", user.memberId);
            try {
                const populated = await user.populate('memberId');
                console.log("Populated Member Name:", populated.memberId ? populated.memberId.name : "NULL (Check ID match)");
            } catch (err) {
                console.error("Population Error:", err.message);
            }
        } else {
            console.log("User admin@kean.edu not found");
        }

        process.exit(0);
    } catch (error) {
        console.error("Script Error:", error);
        process.exit(1);
    }
};

checkModels();
