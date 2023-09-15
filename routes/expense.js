const express = require('express');

const expenseController = require('../controllers/expense')
const userController = require('../controllers/users')
const userAuth = require('../middleware/auth');

 const userRoutes = express.Router();


userRoutes.post('/expense', userAuth.auth, expenseController.expenseData);

userRoutes.get('/expense/get', userAuth.auth, expenseController.getData);

userRoutes.delete('/delete/:id', userAuth.auth, expenseController.deleteData);

userRoutes.post('/user/signup', userController.userData);

userRoutes.post('/user/login', userController.loginCheck);

userRoutes.get('/premium/leader-board', expenseController.getAllData);


module.exports = userRoutes;