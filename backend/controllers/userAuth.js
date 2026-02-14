const User = require("../model/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail")
const mongoose = require("mongoose");

const { holdings } = require("../data/data");

const Watchlist = require("../model/WatchListModel")
const { WalletsModel } = require("../model/WalletsModel");
const HoldingsSchema = require("../schema/HoldingsSchema");
const HoldingsModel = mongoose.model("Holding", HoldingsSchema);


const addHoldingsForNewUser = async (userId) => {
    for (let i = 0; i < holdings.length; i++) {
        const data = {
            userId: userId,
            symbol: holdings[i].name,
            quantity: holdings[i].qty,
            avg: holdings[i].avg

        }
        await HoldingsModel.create(data);
    }
}
const addWallet = async (userId) => {
    const data = {
        userId: userId,
    }
    await WalletsModel.create(data);
};
const addwatchlistForNewUser = async (userId) => {
    const watchlist = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX", "BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:BNBUSDT"];
    const filteredData = watchlist.map(item => ({
        userId: userId,
        symbol: item
    }));
    await Watchlist.insertMany(filteredData);
}


module.exports.signin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ success: false, message: "Invalid email format" });
    }

    // Validate username length
    if (username.length < 3 || username.length > 20) {
        return res.json({ success: false, message: "Username must be 3-20 characters" });
    }

    // Validate password length
    if (password.length < 6) {
        return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    try {
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const data = await User.create({
            username,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            { id: data._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        await addHoldingsForNewUser(data._id);
        await addWallet(data._id);
        await addwatchlistForNewUser(data._id);
        // Send welcome email in background (non-blocking).
        // Do not await this; deployment SMTP/network latency must not delay response.
        sendEmail(
            data.email,
            "Welcome to TRADENOW",
            `Hi ${data.username},

                Your TRADENOW account has been created successfully.

                You can now log in and start using the platform.

                If this wasn’t you, please ignore this email.

                — Team TRADENOW`
        ).then(() => {
            console.log("Welcome email sent");
        }).catch((emailErr) => {
            console.log("Welcome email failed:", emailErr.message);
        });

        // Return success immediately so signup/redirect is never blocked by SMTP delays.
        return res.json({ success: true, message: "Registered successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Fill All Details" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid Details" });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.json({ success: false, message: "Invalid Details" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "Logged in successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

module.exports.logout = (req, res) => {
    try {
        // Clear cookie with explicit path and domain settings
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            domain: process.env.NODE_ENV === "production" ? undefined : undefined
        });

        // Also clear any potential variations of the cookie
        res.clearCookie("token", { path: "/" });
        res.clearCookie("token", { path: "/api" });
        res.clearCookie("token", { path: "/dashboard" });
        res.clearCookie("token", { path: "/frontend" });

        // Set response headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        return res.json({ success: true, message: "Logged Out Successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};


module.exports.sendVerificationCode = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.json({ success: false, message: "Unauthorized — user not found" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Wrong Details" });
        }

        const otp = String(100000 + Math.floor(Math.random() * 900000));
        const otpExpireAt = Date.now() + 1000 * 60 * 5;

        const updatedInfo = await User.findByIdAndUpdate(
            userId,
            {
                verifyOtp: otp,
                verifyOtpExpireAt: otpExpireAt
            },
            { new: true }
        );

        await sendEmail(
            updatedInfo.email,
            "Account Verification OTP",
            `Hi ${updatedInfo.username},

            Your One-Time Password (OTP) for verifying your TRADENOW account is:

            ${otp}

            This OTP is valid for 5 minutes.

            — Team TRADENOW`
        );

        return res.json({ success: true, message: "OTP sent successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


module.exports.verifyAccount = async (req, res) => {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Wrong Details" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const updatedInfo = await User.findByIdAndUpdate(
            userId,
            {
                isAccountVerified: true,
                verifyOtp: "",
                verifyOtpExpireAt: 0
            },
            { new: true }
        );

        return res.json({ success: true, message: "Email Verified Successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Invalid Details" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Details" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expireTime = Date.now() + 5 * 60 * 1000; // 5 minutes

        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                resetOtp: otp,
                resetOtpExpireAt: expireTime
            },
            { new: true }
        );

        await sendEmail(
            email,
            "Password Reset OTP",
            `Hi,

            We received a request to reset the password for your TRADENOW account.

            Your One-Time Password (OTP) is:
            ${otp}

            This OTP is valid for 5 minutes.
 
            — Team TRADENOW`
        );


        return res.json({ success: true, message: "OTP sent to your email" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Fill All Details" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Details" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP is NOT valid" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                resetOtp: "",
                resetOtpExpireAt: 0
            },
            { new: true }
        );

        return res.json({ success: true, message: "Password has been updated" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


module.exports.isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: "User Authenticated" });
    } catch (err) {
        return res.json({ success: false, message: err.message });

    }
}


module.exports.getUserData = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.json({ success: false, message: "Not authorized" });
    }

    try {
        const user = await User.findById(userId).select(
            "username email isAccountVerified"
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            userData: {
                userId: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isAccountVerified,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
