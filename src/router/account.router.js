const express = require('express');
const { model } = require('mongoose');
const { authMiddleware } = require('../middleware/auth.middleware');
const { createAccountController } = require('../controllers/account.controller');
const router = express.Router();
// const accountController = require('../controllers/account.controller');

// POST /api/v1/accounts
// Create a new account for the authenticated user
/**
 * -POST /api/v1/accounts
 * -Create a new account 
 * -Protected route, requires authentication
 */
router.post("/",authMiddleware,createAccountController);

 module.exports = router;