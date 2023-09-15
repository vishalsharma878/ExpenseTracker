const expense = require('../models/database')
const sequelize = require('../utils/databasePath');
const User = require('../models/user')


exports.expenseData = async (req, res) =>{
  const t = await sequelize.transaction();
    let expenseAmount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    try {
    const user = await expense.create({
        expenseAmount: expenseAmount,
        description: description,
        category: category,
        userId: req.user.id
    }, {transaction: t})
    
    //Updating total expense
    
      const previousExpenseAmount = req.user.totalExpense;
      expenseAmount = Number(expenseAmount);
       await req.user.update({totalExpense: previousExpenseAmount + expenseAmount}, {transaction: t});
      
       await t.commit();
       res.status(200).json(user)
      
    }
      catch(err){
        await t.rollback();
        console.log(err)
      }
    
}

exports.deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const expenseData = await expense.findOne({ where: { id: id, userId: req.user.id } }); 
    if (!expenseData) {
      // Handle the case where the expense with the given ID doesn't exist
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy({ where: { id: id, userId: req.user.id } });

    const updatedTotalExpense = req.user.totalExpense - expenseData.expenseAmount;

    // Update the user's totalExpense
    await req.user.update({ totalExpense: updatedTotalExpense });

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//Get the Expense Data
exports.getData = async (req, res) => {
    const data = await expense.findAll({where:{userId: req.user.id}})
      res.status(200).json(data); // Set status code and send JSON response
  }

//Get the expense data for the leadeboard
  exports.getAllData = async (req, res) => {
    try{
        const usersWithTotalExpenses = await User.findAll({
            attributes: [ 'name', 'totalExpense'],
                order: [['totalExpense', 'DESC']]

          });

          res.status(200).json(usersWithTotalExpenses);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Something went wrong"});
    }
  }
 