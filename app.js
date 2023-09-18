const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./utils/databasePath');
const User  = require('./models/user');
const Expense = require('./models/database');
const Order = require('./models/purchase');
const forgotPassword = require('./models/forgot-password');

const expense = require('./routes/expense');
const purchase = require('./routes/purchase');
const resetPassword = require('./routes/reset-password');

app.use(cors());
app.use(bodyParser.json());

app.use(expense);
app.use(purchase);
app.use(resetPassword);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

sequelize
  .sync()
  .then(result => {
 
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
