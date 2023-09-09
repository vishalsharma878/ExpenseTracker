const expense = require('../models/database')


exports.expenseData = (req, res) =>{
    
    const email = req.body.email;
    const expenseAmount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    expense.create({
        email: email,
        expenseAmount: expenseAmount,
        description: description,
        category: category
    })
    .then((data) => res.status(200).json(data))
    
}

exports.getData = (req, res) => {
    expense.findAll()
      .then((data) => res.status(200).json(data)); // Set status code and send JSON response
  }
 