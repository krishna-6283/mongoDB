const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const validateSignup = require('../middleware/validateSignup');  // Middleware to validate signup data
const validateLogin = require('../middleware/validateLogin');    // Middleware to validate login data

