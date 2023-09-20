const express = require('express');

const expenseController = require('../controllers/expense')
const userController = require('../controllers/users')
const userAuth = require('../middleware/auth');
const user = require('../models/user');

 const userRoutes = express.Router();


userRoutes.post('/expense', userAuth.auth, expenseController.expenseData);

userRoutes.get('/expense/get/:page/:chooseExpenses', userAuth.auth, expenseController.getData);

userRoutes.delete('/delete/:id', userAuth.auth, expenseController.deleteData);

userRoutes.post('/user/signup', userController.userData);

userRoutes.post('/user/login', userController.loginCheck);

userRoutes.get('/premium/leader-board', expenseController.getAllData);

userRoutes.get('/expenses/download', userAuth.auth, expenseController.downloadExpenses);

userRoutes.get('/expenses/for-report/:dateRange', userAuth.auth, expenseController.getExpensesForReport);

userRoutes.get('/expenses/file-urls', userAuth.auth, expenseController.expensesUrls);


module.exports = userRoutes;