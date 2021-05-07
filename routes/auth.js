const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',    
    [
        check('email', 'Enter Valid email.').isEmail(),
        check('password', 'Input required').not().isEmpty()

    ],
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;