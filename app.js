const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/databasePath');
const User  = require('./models/user');
const Expense = require('./models/database');

const expense = require('./routes/expense')

app.use(cors());
app.use(bodyParser.json());

app.use(expense);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(result => {
 
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
