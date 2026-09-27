import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { users, getPublicUser } from '../data/store.js';
import { signToken } from '../middleware/authMiddleware.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'customer',
      });

      const token = signToken({ id: newUser._id.toString(), email: newUser.email, role: newUser.role });
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      });
    }

    // In-memory fallback if MongoDB is not connected
    const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    const token = signToken(newUser);

    return res.status(201).json({ success: true, token, user: getPublicUser(newUser) });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
      return res.json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // In-memory fallback
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ success: true, token, user: getPublicUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    const user = users.find((item) => item.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: getPublicUser(user) });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to get user.' });
  }
};

