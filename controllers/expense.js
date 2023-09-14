const expense = require('../models/database')
const sequelize = require('../utils/databasePath');
const User = require('../models/user')


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

//Get the Expense Data
exports.getData = async (req, res) => {
    const data = await expense.findAll({where:{userId: req.user.id}})
      res.status(200).json(data); // Set status code and send JSON response
  }

//Get the expense data for the leadeboard
  exports.getAllData = async (req, res) => {
    try{
        const usersWithTotalExpenses = await User.findAll({
            attributes: [ 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseAmount')), 'totalExpense']],
            include: [
              {
                model: expense,
                attributes: []
              }
            ],
                group: ['users.id'],
                order: [['totalExpense', 'DESC']]

          });

          res.status(200).json(usersWithTotalExpenses);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Something went wrong"});
    }
  }
 