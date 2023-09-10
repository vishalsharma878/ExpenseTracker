const express = require('express');

const expenseController = require('../controllers/expense')
const deleteController = require('../controllers/delete')
const userController = require('../controllers/users')

 const userRoutes = express.Router();


userRoutes.post('/expense', expenseController.expenseData);

userRoutes.get('/expense/get', expenseController.getData);

userRoutes.delete('/delete/:id', deleteController.deleteData);

userRoutes.post('/user/signup', userController.userData);

userRoutes.post('/user/login', userController.loginCheck);


module.exports = userRoutes;