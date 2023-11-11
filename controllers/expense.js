const Expense = require('../models/expense')
const User = require('../models/user')
const AWS = require('aws-sdk');
const mongoose = require('mongoose');

const ExpensesUrls = require('../models/file-url');

function uploadToS3(data, fileName) {

  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

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
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log('success', res);
        resolve(res.Location);
      }
    })
  })

}

exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId: userId });

    const stringExpenses = JSON.stringify(expenses);
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringExpenses, fileName);
    await ExpensesUrls.create({ url: fileURL, userId: userId });
    res.status(200).json({ fileURL, success: true });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ err: err, success: false })
  }
}


exports.expenseData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expenseAmount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    // Creating expense
    const expense = await Expense.insertMany([
      {
        expenseAmount: expenseAmount,
        description: description,
        category: category,
        userId: req.user._id // Assuming req.user contains the logged-in user
      }],
      { session: session }
    );

    // Updating total expense for the user
    const previousExpenseAmount = req.user.totalExpense || 0;
    const updatedTotalExpense = previousExpenseAmount + Number(expenseAmount);
    await req.user.updateOne({ totalExpense: updatedTotalExpense }, { session: session });

    await session.commitTransaction();
    res.status(200).json(expense);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    session.endSession();
  }
};

exports.deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const expenseData = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expenseData) {
      // Handle the case where the expense with the given ID doesn't exist
      return res.status(404).json({ error: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(id);

    const updatedTotalExpense = req.user.totalExpense - expenseData.expenseAmount;

    // Update the user's totalExpense
    await req.user.updateOne({ totalExpense: updatedTotalExpense });

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//Get the Expense Data

exports.getData = async (req, res) => {
  try {
    let itemPerPage = Number(req.params.chooseExpenses);
    const page = Number(req.params.page);
    const totalExpenses = await Expense.countDocuments({ userId: req.user._id });
    const data = await Expense.find({ userId: req.user._id })
    .skip((page - 1) * itemPerPage)
    .limit(itemPerPage);

    res.status(200).json({
      expenses: data,
      currentPage: page,
      hasNextPage: page * itemPerPage < totalExpenses,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
    }); // Set status code and send JSON response
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
}

//Get the expense data for the leadeboard
exports.getAllData = async (req, res) => {
  try {
    const usersWithTotalExpenses = await User.find({}).select('name totalExpense').sort({totalExpense: -1});
    res.status(200).json(usersWithTotalExpenses);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

//Get expense for report

exports.getExpensesForReport = async (req, res) => {

  try {
    const dateRange = req.params.dateRange; // Get the date range option from the query
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
    const expenses = await Expense.find({ userId: req.user._id, 
      createdAt: {
        $gte: startDate,
        $lte: endDate,
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
  try {
    const urls = await ExpensesUrls.find({userId: req.user._id });
    res.status(200).json(urls);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
}
