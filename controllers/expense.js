const expense = require('../models/database')


exports.expenseData = (req, res) =>{
    
    const expenseAmount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    
    expense.create({
        expenseAmount: expenseAmount,
        description: description,
        category: category,
        userId: req.user.id
    })
    .then((data) => res.status(200).json(data))
    
}

exports.getData = (req, res) => {
    expense.findAll({where: {userID: req.user.id}})
      .then((data) => res.status(200).json(data)); // Set status code and send JSON response
  }
 