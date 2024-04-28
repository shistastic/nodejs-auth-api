const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
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

// Importing and configuring the authentication function
const authHandler = require('./functions/auth');
app.use('/.netlify/functions/auth', authHandler.handler);

// Importing and configuring the tasks function
const tasksHandler = require('./functions/tasks');
app.use('/.netlify/functions/tasks', tasksHandler.handler);

// Export the app as the handler for Serverless framework
module.exports.handler = serverless(app);
