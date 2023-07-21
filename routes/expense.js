const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

// router.get('/', expenseController.getExpense);

router.get('/get-expenses/', userAuthentication.athenticate, expenseController.getExpenses);

router.post('/add-expense', userAuthentication.athenticate, expenseController.postAddExpense);

router.delete('/delete-expense/:id', userAuthentication.athenticate, expenseController.postDeleteExpense);

router.get('/download', userAuthentication.athenticate, expenseController.uploadFile);

router.get('/download/getfiles', userAuthentication.athenticate, expenseController.getfiles);

router.get("/leaderboard", userAuthentication.athenticate, expenseController.getpremiumFeature);

module.exports = router ;