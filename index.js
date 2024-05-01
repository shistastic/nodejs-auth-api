const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http')
const bodyParser = require('body-parser');
const router = require('./functions/tasks');

require('dotenv').config();

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB configuration
const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const PORT = process.env.PORT || 5000;

 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 app.use('/api/auth', require('./functions/auth'));
 app.use('/api/tasks', require('./functions/tasks'));
 
 app.get('/', (req, res) => {
  res.send('{"Hey this is my API running 🥳"}')
});

 module.exports = app;