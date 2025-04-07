const express = require('express');
const { protect } = require("../middleware/authMiddleware");

const {
    loginUser,
    registerUser,
    getUserInfo
} = require('../controllers/authController');

// Initializing the Router
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

module.exports = router;