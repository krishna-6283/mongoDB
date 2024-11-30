const User = require('../models/User'); // User model
const jwt = require('jsonwebtoken'); // For token generation
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config(); // To access environment variables

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 */
exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email is already in use
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error); // Pass error to the centralized error handler
    }
};

/**
 * @route POST /api/auth/login
 * @desc Authenticate a user and return a JWT token
 */
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET,           // Secret key
            { expiresIn: '1h' }               // Expiration time
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};
