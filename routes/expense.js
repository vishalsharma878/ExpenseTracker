const express = require('express');

const expenseController = require('../controllers/expense')
const deleteController = require('../controllers/delete')
const userController = require('../controllers/users')
const userAuth = require('../middleware/auth');

 const userRoutes = express.Router();


userRoutes.post('/expense', userAuth.auth, expenseController.expenseData);

userRoutes.get('/expense/get', userAuth.auth, expenseController.getData);

userRoutes.delete('/delete/:id', userAuth.auth, deleteController.deleteData);

userRoutes.post('/user/signup', userController.userData);

userRoutes.post('/user/login', userController.loginCheck);


module.exports = userRoutes;