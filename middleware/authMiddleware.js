import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { isDbConnected, readStore } from '../utils/localStore.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'christ_tabernacle_secret_fallback');

      if (isDbConnected()) {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
          return res.status(401).json({ success: false, message: 'Admin account not found' });
        }
        req.admin = admin;
      } else {
        const store = readStore();
        const admin = (store.admins || []).find((a) => a._id === decoded.id || a.username === decoded.id);
        if (!admin) {
          return res.status(401).json({ success: false, message: 'Admin account not found in store' });
        }
        const { password, ...adminWithoutPassword } = admin;
        req.admin = adminWithoutPassword;
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: No authorization token provided' });
  }
};
