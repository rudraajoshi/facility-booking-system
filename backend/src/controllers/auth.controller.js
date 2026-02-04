const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');


const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


const sanitizeUser = (user) => {
  const { password, ...userData } = user.dataValues;
  return userData;
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, STATUS.BAD_REQUEST, 'Name, email and password are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    const token = generateToken(user.user_id, user.role);

    return createdResponse(res, MESSAGES.REGISTER_SUCCESS, {
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, STATUS.BAD_REQUEST, 'Email and password are required');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
    }

    const token = generateToken(user.user_id, user.role);

    return successResponse(res, MESSAGES.LOGIN_SUCCESS, {
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return errorResponse(res, STATUS.NOT_FOUND, 'User not found');
    }
    return successResponse(res, 'Profile fetched successfully', sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return errorResponse(res, STATUS.NOT_FOUND, 'User not found');
    }

    if (name)  user.name  = name;
    if (email) user.email = email;
    await user.save();

    return successResponse(res, MESSAGES.PROFILE_UPDATED, sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};