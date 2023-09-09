const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/databasePath');

const expense = require('./routes/expense')

app.use(cors());
app.use(bodyParser.json());


app.use(expense);

sequelize
  .sync()
  .then(result => {
 
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
