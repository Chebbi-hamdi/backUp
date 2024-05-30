var express = require('express');
var router = express.Router();
const userController = require('../../controllers/user.controller');


router.post('/password-reset', userController.requestPasswordReset);
router.post('/requestEmailVerification', userController.requestEmailVerification);
router.get('/verify-email/:token', userController.verifyEmail);

module.exports = router;

