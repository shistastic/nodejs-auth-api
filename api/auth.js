/** 
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserDTO = require('../models/user.js')
const app = require('../index'); 

const { check, validationResult } = require('express-validator');

// REGISTRO USUARIO
app.post('/register', [
  check('name', 'Campo obligatorio name').not().isEmpty(),
  check('email', 'Campo obligatorio email').isEmail(),
  check('password', 'Formato incorrecto contraseña (6 o más caracteres)').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await UserDTO.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuario ya registrado con el email especificado' });
    } 

    user = new UserDTO({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET);

    // STATUSCODE 200
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// LOGIN USUARIO
app.post('/login', [
  check('email', 'Formato no valido email').isEmail(),
  check('password', 'Campo obligatorio password').exists()
], async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructuración body recibido por usuario
  const { email, password } = req.body;

  try {
    let user = await UserDTO.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET);

    // STATUSCODE 200
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// REFRESCAR TOKEN USUARIO
app.post('/refreshToken', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token provided' });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ msg: 'Invalid refresh token' });
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET);

      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/
