import jwt from "jsonwebtoken";

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30d' });
};
export default generateToken;