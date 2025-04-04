import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// if the export was export default no need to put {}
// if it has mulitple exports use {}
import User  from '../models/User.js';


const createTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

export const signup = async (req, res) => {
  try {
    const { username, email, full_name, password } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
    const existing_email = await User.findOne({ where: { username } });
    if (existing_email) return res.status(400).json({ error: 'Email already exists' });
    const salt = await bcrypt.genSalt(14)
    const hashed = await bcrypt.hash(password,salt);
    const user = await User.create({
      username,
      email,
      full_name,
      password: hashed,
    });

    createTokenAndSetCookie(user, res);
    res.status(201).json({ message: 'Signup successful', user: { id: user.user_id, username: user.username } });
  } catch (err) {
    console.error('[Signup Error]', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    createTokenAndSetCookie(user, res);
    res.status(200).json({ message: 'Login successful', user: { id: user.user_id, username: user.username } });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error('[Get User Error]', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
