const Expense = require('../models/database')

exports.deleteData = (req, res) => {
  const id = req.params.id;
  Expense.destroy({ where: { id: id, userId: req.user.id } })
    .then(expense => {
      if (!expense) {
        // If the expense with the given ID and user ID doesn't exist, return a 404 response
        return res.status(404).json({ error: 'Expense not found' });
      } else {
        // Successfully deleted the expense, return a success response
        return res.status(200).json({ message: 'Expense deleted successfully' });
      }
    })
    .catch(err => {
      // Handle any errors that occur during the delete operation
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    });
}
