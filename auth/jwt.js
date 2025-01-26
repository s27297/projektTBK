const jwt = require('jsonwebtoken');
const Secret=process.env.JWT_SECRET;
const generateToken = (payload) => {
    return jwt.sign(
        payload,
        Secret,
        { expiresIn: "7d" }
    );
};

const verifyToken = (token) => {
    // console.log(decodeToken(token));
    try {
        return jwt.verify(token,Secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log(error);
            throw new Error('Token wygasł');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Nieprawidłowy token');
        }
        throw error;
    }
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};