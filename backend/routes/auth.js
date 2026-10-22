const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (u) =>
  jwt.sign({ id: Number(u.id), name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

function validateRegister(body) {
  const { name, email, password } = body || {};
  if (!name || !email || !password) return 'Name, email and password are required';
  if (name.trim().length < 2 || name.trim().length > 100) return 'Name must be 2-100 characters';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  if (password.length < 6 || password.length > 128) return 'Password must be 6-128 characters';
  return null;
}

function validateLogin(body) {
  const { email, password } = body || {};
  if (!email || !password) return 'Email and password are required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return null;
}

router.post('/register', (req, res) => {
  const err = validateRegister(req.body);
  if (err) return res.status(400).json({ error: err });
  const { name, email, password } = req.body;
  try {
    const info = db
      .prepare('INSERT INTO users(name,email,password_hash) VALUES (?,?,?)')
      .run(name.trim(), email.trim().toLowerCase(), bcrypt.hashSync(password, 10));
    res.json({ token: sign({ id: info.lastInsertRowid, name: name.trim() }), name: name.trim() });
  } catch {
    res.status(409).json({ error: 'Email already registered' });
  }
});

router.post('/login', (req, res) => {
  const err = validateLogin(req.body);
  if (err) return res.status(400).json({ error: err });
  const { email, password } = req.body;
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(String(email || '').trim().toLowerCase());
  if (!u || !bcrypt.compareSync(String(password || ''), u.password_hash))
    return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: sign(u), name: u.name });
});

module.exports = router;