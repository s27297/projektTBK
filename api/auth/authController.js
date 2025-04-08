//./src/controllers/authController.js
const User = require('../schemas/userSchema.js');
const { generateToken ,decodeToken} = require('./jwt.js');
const { comparePassword } = require('./passwordUtils.js');
const { promisify } = require('util');
const History=require('../schemas/historySchema.js');
class AuthController {

    async login(req, res, next) {
        try {
            const { login, password } = req.body;
console.log(login, password);
            // Sprawdzenie czy podano wymagane pola
            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Proszę podać login i hasło'
                });
            }

            // Pobranie użytkownika z bazy wraz z hasłem
            const user = await User.findOne({ login }).select('+password');
            if (!user ) {
                return res.status(401).json({
                    success: false,
                    message: 'Nieprawidłowe dane logowania'
                });
            }
            if (!user.isActive ) {
                return res.status(401).json({
                    success: false,
                    message: 'user jest zablokowany'
                });
            }

            // Weryfikacja hasła
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Nieprawidłowe dane logowania'
                });
            }

            // Aktualizacja ostatniego logowania
           // user.lastLogin = new Date();
           // await user.save();

            // Generowanie tokenu
            const token = generateToken({ id: user._id });

            const history=new History({
                user:user.id,
                objekt:"user",
                action:"login"
            })
           await history.save()
         //  delete userResponse.password;
            user.password=null
            res.json({
                success: true,
                token,
                user: user
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Pobranie użytkownika z hasłem
            const user = await User.findById(userId).select('+password');

            // Weryfikacja aktualnego hasła
            const isCurrentPasswordValid = await comparePassword(
                currentPassword,
                user.password
            );

            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Aktualne hasło jest nieprawidłowe'
                });
            }

            // Aktualizacja hasła
            user.password = newPassword;
            await user.save();

            const history=new History({
                user:user.id,
                objekt:"user",
                action:"changed password"
            })
            await history.save()
            res.json({
                success: true,
                message: 'Hasło zostało zmienione'
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res) {
        // W przypadku JWT, właściwe wylogowanie powinno być obsługiwane po stronie klienta
        // poprzez usunięcie tokenu. Tutaj możemy tylko potwierdzić operację.
        let user=req.user
        // user.lastLogout=Date.now()
        // user.save()
        const history=new History({
            user:req.user.id,
            objekt:"user",
            action:"logout"
        })
        await history.save()
        res.json({
            success: true,
            message: 'Wylogowano pomyślnie'
        });
    }
}

module.exports = new AuthController();