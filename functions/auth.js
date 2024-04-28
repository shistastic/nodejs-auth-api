const express = require('express');
const serverless = require('serverless-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

const app = express();
const router = express.Router();

// Body parser middleware
app.use(express.json());

/******** REGISTRATION *********/
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const accessToken = generateToken(user.id, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user.id, process.env.JWT_REFRESH_SECRET);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/******** LOGIN *********/
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const accessToken = generateToken(user.id, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user.id, process.env.JWT_REFRESH_SECRET);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/******** REFRESH TOKEN *********/
router.post('/refreshToken', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ msg: 'Invalid refresh token' });
      }

      const accessToken = generateToken(user.id, process.env.JWT_SECRET, '1h');
      const newRefreshToken = generateToken(user.id, process.env.JWT_REFRESH_SECRET);

      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to generate JWT tokens
function generateToken(userId, secret, expiresIn = '1h') {
  return jwt.sign({ id: userId }, secret, { expiresIn });
}

// Use the router for the app
app.use('/.netlify/functions/auth', router);

// Export the app as the handler for Serverless framework
module.exports.handler = serverless(app);