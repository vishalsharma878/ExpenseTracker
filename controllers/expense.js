const expense = require('../models/database')
const sequelize = require('../utils/databasePath');
const User = require('../models/user')
const AWS = require('aws-sdk');

const { Op } = require('sequelize'); // Sequelize's operators for querying
const ExpensesUrls = require('../models/file-url');

function uploadToS3(data, fileName){
    
   const BUCKET_NAME = '';
   const IAM_USER_KEY = '';
   const IAM_USER_SECRET = '';

   let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
   })

   
    var params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read'
    }
     return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, res) => {
        if(err){
          console.log(err);
          reject(err);
        }
        else{
          console.log('success', res);
           resolve(res.Location);
        }
      })
     })
      
}

exports.downloadExpenses = async (req, res) => {
  try{
  const expenses = await req.user.getExpenses();
  
  const stringExpenses = JSON.stringify(expenses);
  const userId = req.user.id;
  const fileName = `Expense${userId}/${new Date()}.txt`;
  const fileURL = await uploadToS3(stringExpenses, fileName);
  await ExpensesUrls.create({url: fileURL, userId: req.user.id});
  res.status(200).json({fileURL, success: true});
  }
  catch(err){
    console.log(err)
    res.status(500).json({err: err, success: false})
  }
}


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

  //Get expense for report

  exports.getExpensesForReport = async (req, res) => {

  try {
    const  dateRange  = req.params.dateRange; // Get the date range option from the query
   console.log(dateRange);
    let startDate, endDate;

    // Determine the date range based on the option
    switch (dateRange) {
      case 'daily':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date();
        break;
      case 'weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date();
        break;
      case 'monthly':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date();
        break;
      default:
        break;
    }

    // Fetch expenses within the specified date range
    const expenses = await req.user.getExpenses({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Return the expenses as JSON response
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

  }

  //get previous expenses download urls

  exports.expensesUrls = async (req, res) => {
      try{
        const urls = await ExpensesUrls.findAll({where: {userId: req.user.id}});
        res.status(200).json(urls);
      }
      catch(err){
        console.log(err);
        res.status(500).json({success: false});
      }
  }
 