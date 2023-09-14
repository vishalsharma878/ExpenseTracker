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

//Get the expense data in for the leadeboard
  exports.getAllData = async (req, res) => {
    try{
    const expenses = await expense.findAll();
    const users =   await User.findAll();

    const expenseSum = {};
    expenses.forEach((expense) => {
        if(expenseSum[expense.userId]){
        expenseSum[expense.userId] = expenseSum[expense.userId] + expense.expenseAmount; 
        }
        else{
            expenseSum[expense.userId] = expense.expenseAmount;
        }
    })
      const usersWithTotalExpenses = [];
    users.forEach((user) => {
        let userInObject = expenseSum[user.id]
        if(userInObject == undefined){
            userInObject = 0;
        }
         usersWithTotalExpenses.push({name: user.name, totalExpense: userInObject})
    })
     usersWithTotalExpenses.sort((a, b)=>{
        if(a.totalExpense<b.totalExpense) return 1;
        if(a.totalExpense>b.totalExpense) return -1;
     });
    res.status(200).json(usersWithTotalExpenses);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Something went wrong"});
    }
  }
 