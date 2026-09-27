import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { users, getPublicUser } from '../data/store.js';
import { signToken } from '../middleware/authMiddleware.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user-${randomUUID()}`,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = signToken(newUser);

  return res.status(201).json({ success: true, token, user: getPublicUser(newUser) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = signToken(user);
  return res.json({ success: true, token, user: getPublicUser(user) });
};

export const getCurrentUser = (req, res) => {
  const user = users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({ success: true, user: getPublicUser(user) });
};
