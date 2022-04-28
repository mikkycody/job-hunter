import jwt from 'jsonwebtoken';
import moment from 'moment';
import validateSignIn from '../helpers/validateSignin';
import validateSignUp from '../helpers/validateSignup';
import AuthServices from '../services/authServices';
import UserServices from '../services/userServices';
import sendEmail from '../helpers/sendEmail';
import validatePasswordAndToken from '../helpers/validatePasswordAndToken';
import validateEmail from '../helpers/validateEmail';

/**
 * This method creates a new user account
 * @param {object} req
 * @param {object} res
 * @returns an object response with token and user data
 */
const signupUser = async (req, res) => {
  const {roleId, email, password } = req.body;
  const { error } = validateSignUp(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    const userExists = await AuthServices.isExistingUser(email);
    if (userExists) {
      return res.status(409).json({
        error: 'A user with that email exists already',
      });
    }

    const checkUsername = await UserServices.getUserByUsername(
      req.body.email.split('@')[0]
    );
    let username = '';
    if (checkUsername) {
      username = `${req.body.email.split('@')[0]}${Math.floor(
        Math.random() * 100
      )}`;
    } else {
      username = req.body.email.split('@')[0];
    }

    const hashedPassword = await AuthServices.hashPassword(password);
    const confirmationCode = jwt.sign({ email }, process.env.JWT_SECRET);
    const userPayload = {
      username,
      email,
      confirmationCode,
      password: hashedPassword,
      companyName: req.body.companyName ?? null,
      website: req.body.website ?? null,
      industry: req.body.industry ?? null,
    };

    const user = await AuthServices.registerUser(userPayload);
    const roles = await AuthServices.createUserRoles(user, roleId);
    const token = await AuthServices.generateToken(user, roles[0]);
    const html = `<h1>Email Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for registering. Please confirm your email by clicking on the following link</p>
        <a href=https://clientptp.vercel.app/auth/verify?token=${confirmationCode}> Click here</a
        </div>`;
    await sendEmail(email, 'Please confirm your account', html);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        expertise: user.expertise,
        about: user.about,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: roles[0],
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method logs in a user
 * @param {object} req
 * @param {object} res
 * @returns an object response with token and user data
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateSignIn(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const user = await AuthServices.getUser(email);
    if (!user) {
      return res.status(401).json({
        error: 'Login failed',
      });
    }
    const passwordValid = await AuthServices.validatePassword(
      password,
      user.dataValues.password
    );
    if (!passwordValid) {
      return res.status(401).json({
        message: 'Login failed',
      });
    }
    if (user.isDisabled) {
      return res.status(401).json({
        message: 'Account disabled!',
      });
    }
    if (!user.emailVerifiedAt) {
      return res.status(401).json({
        message: 'Pending Account. Please Verify Your Email!',
      });
    }
    const token = AuthServices.generateToken(user, user.Roles);

    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const user = await AuthServices.verifyUser(req.params.confirmationCode);
  if (!user) {
    return res.status(400).json({
      message: 'Something went wrong!',
    });
  }

  const now = moment(new Date());
  const end = moment(user.updatedAt);
  const duration = moment.duration(now.diff(end));
  const minutes = duration.asMinutes();

  if (minutes > 30) {
    return res.status(400).json({
      message: 'Link expired!',
      linkExpired: true,
    });
  }

  if (user.emailVerifiedAt !== null) {
    return res.status(400).json({
      message: 'Email already verified!',
    });
  }

  await UserServices.updateUser(user.id, { emailVerifiedAt: Date.now() });

  return res.status(200).json({
    success: true,
    message: 'Email verification successful',
  });
};

const resendVerificationEmail = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const user = await AuthServices.getUser(req.body.email);
  if (!user) {
    return res.status(404).json({
      message: 'Account not found!',
    });
  }

  if (user.emailVerifiedAt !== null) {
    return res.status(400).json({
      message: 'Email already verified!',
    });
  }
  const confirmationCode = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
  );
  const updatedUser = await UserServices.updateUser(user.id, {
    confirmationCode,
  });
  const html = `<h1>Email Confirmation</h1>
        <h2>Hello ${updatedUser[1][0].dataValues.username}</h2>
        <p>Thank you for registering. Please confirm your email by clicking on the following link</p>
        <a href=https://clientptp.vercel.app/auth/verify?token=${updatedUser[1][0].dataValues.confirmationCode}> Click here</a>
        </div>`;
  await sendEmail(
    updatedUser[1][0].dataValues.email,
    'Please confirm your account',
    html
  );
  return res.status(200).json({
    success: true,
    message: 'Email verification resent successfully',
  });
};

const resetPassword = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const user = await AuthServices.getUser(req.body.email);
  if (!user) {
    return res.status(200).json({
      message:
        'An email has just been sent to the email provided if it exists.',
    });
  }

  const confirmationCode = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
  );
  const updatedUser = await UserServices.updateUser(user.id, {
    confirmationCode,
  });
  const html = `<h1>Reset Password</h1>
        <h2>Hello ${updatedUser[1][0].dataValues.username}</h2>
        <p>Please follow the link below to reset your password.</p>
        <a href=https://clientptp.vercel.app/auth/reset-password?token=${updatedUser[1][0].dataValues.confirmationCode}> Click here</a>
        </div>`;
  await sendEmail(updatedUser[1][0].dataValues.email, 'Reset Password', html);
  return res.status(200).json({
    success: true,
    message: 'An email has just been sent to the email provided if it exists.',
  });
};

const changePassword = async (req, res) => {
  const { error } = validatePasswordAndToken(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const user = await AuthServices.verifyUser(req.body.token);
  if (!user) {
    return res.status(400).json({
      message: 'Something went wrong!',
    });
  }

  const now = moment(new Date());
  const end = moment(user.updatedAt);
  const duration = moment.duration(now.diff(end));
  const minutes = duration.asMinutes();

  if (minutes > 30) {
    return res.status(400).json({
      message: 'Link expired!',
      linkExpired: true,
    });
  }

  const hashedPassword = await AuthServices.hashPassword(req.body.password);
  await UserServices.updateUser(user.id, { password: hashedPassword });

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
};

export default {
  signupUser,
  loginUser,
  verifyUser,
  resendVerificationEmail,
  resetPassword,
  changePassword,
};
