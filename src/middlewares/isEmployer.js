/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Access denied, no token provided',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (!(req.user.roles.find((obj) => obj.id === 2))) {
      return res.status(401).json({
        message: 'Access denied',
      });
    }
    next();
  } catch (exception) {
    res.status(401).json({
      message: 'Invalid token',
      expiredKey: true,
    });
  }
};
