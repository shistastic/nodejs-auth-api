const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http')
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const router = express.Router();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB configuration
const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/.netlify/functions/auth', router);
app.use('/.netlify/functions/tasks', router);


module.exports.handler = serverless(app);
