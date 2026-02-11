const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const EventRoutes = require("./src/routes/eventRoutes");
const AuthRoutes = require("./src/routes/AuthRoutes");
const ProfileRoutes = require("./src/routes/ProfileRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middleware
app.use(cors({
    origin: true, // Auto-reflect origin
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(helmet());

// Base Rate Limiter (100 reqs per 15 min)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/auth", limiter);
app.use("/api/upload", limiter);

// Database connection
// Database connection
if (require.main === module) {
    connectDB();
}

// Routes
app.use("/api/events", EventRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/profiles", ProfileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/invites", require("./src/routes/inviteRoutes"));


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;