//./src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController.js');
const { authenticate } = require('./authMiddleware.js');


// Rejestracja i logowanie (publiczne endpointy)


router.post('/login',
    authController.login
);

// Chronione endpointy (wymagają autoryzacji)
router.use(authenticate);

router.post('/change-password',
   // rateLimiter.check,
    authController.changePassword
);

router.post('/logout',
    authController.logout
);

// Endpoint do weryfikacji tokenu
router.get('/verify', (req, res) => {
    // Jeśli middleware authenticate przepuścił request, token jest ważny
    res.json({
        success: true,
        user: req.user
    });
});

// Obsługa błędów dla tej grupy routingu
router.use((err, req, res, next) => {
    console.error('Auth Route Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Błąd podczas przetwarzania żądania autoryzacji'
    });
});

module.exports = router;