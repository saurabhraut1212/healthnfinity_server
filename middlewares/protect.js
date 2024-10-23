import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Auth.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(400).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(400).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(400).json({ message: 'Not authorized as an admin' });
    }
};


