const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.get("/sign-up", userController.getSignUpPage)

router.post("/sign-up", userController.postsignUpPage);

router.get("/login", userController.getLoginPage);

router.post("/login", userController.postLoginPage);

module.exports = router ;