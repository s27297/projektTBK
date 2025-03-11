//./src/middleware/authMiddleware.js
const { verifyToken } = require('./jwt.js');
const User = require('../schemas/userSchema.js');

const authenticate = async (req, res, next) => {
    try {
        // Sprawdzenie czy token jest obecny w nagłówku
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Brak tokenu autoryzacyjnego'
            });
        }

        // Pobranie i weryfikacja tokenu
        const token = authHeader.split(' ')[1];
        // console.log(token);
        const decoded = verifyToken(token);

        // Sprawdzenie czy użytkownik istnieje i jest aktywny
        const user = await User.findById(decoded.id).select('-password');
        if (!user||!user.isActive ) {
            return res.status(401).json({
                success: false,
                message: 'Użytkownik nie istnieje lub jest nieaktywny'
            });
        }

        // Dodanie danych użytkownika do obiektu request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Nieprawidłowy token'
        });
    }
};

const authorize = (req,res,next) => {
        console.log(req.user);
        if (req.user.Admin===false) {
            return res.status(403).json({
                success: false,
                message: 'Brak uprawnień do wykonania tej operacji'
            });
        }
        next();
};
//
// const rateLimiter = {
//     windowMs: 15 * 60 * 1000, // 15 minut
//     maxAttempts: 5,
//     attempts: new Map(),
//
//     check: (req, res, next) => {
//         const ip = req.ip;
//         const now = Date.now();
//         const userAttempts = rateLimiter.attempts.get(ip) || [];
//
//         // Usuń stare próby
//         const validAttempts = userAttempts.filter(
//             timestamp => now - timestamp < rateLimiter.windowMs
//         );
//
//         if (validAttempts.length >= rateLimiter.maxAttempts) {
//             return res.status(429).json({
//                 success: false,
//                 message: 'Zbyt wiele prób. Spróbuj ponownie później.'
//             });
//         }
//
//         rateLimiter.attempts.set(ip, [...validAttempts, now]);
//         next();
//     }
// };
//
module.exports = {
    authenticate,
    authorize,
    //rateLimiter
};