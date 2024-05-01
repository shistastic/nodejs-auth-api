const express = require('express');
const app = express();
/** 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();



// Body parser middleware
app.use(bodyParser.json());

// MongoDB configuration
const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
**/
// Routes
const PORT = process.env.PORT || 4000;

 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
/** 
 app.use('/api/auth', require('./functions/auth'));
 app.use('/api/tasks', require('./functions/tasks'));
  */
 app.get('/', (req, res) => {
  res.send('{"Hey this is my API running 🥳"}')
});

 module.exports = app;