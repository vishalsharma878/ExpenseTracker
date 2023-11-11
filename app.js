const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');


const User  = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/purchase');
const forgotPassword = require('./models/forgot-password');

const expense = require('./routes/expense');
const purchase = require('./routes/purchase');
const resetPassword = require('./routes/reset-password');
const expensesUrl = require('./models/file-url');
const path = require('path');

const accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});

app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());


app.use(expense);
app.use(purchase);
app.use(resetPassword);


mongoose
  .connect(process.env.MONGO_CLIENT)
  .then(result => {
    console.log("Connected")
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
