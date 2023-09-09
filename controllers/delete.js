const expense = require('../models/database')

exports.deleteData = (req, res) => {
    const id = req.params.id;
    expense.findByPk(id)
      .then(user => {
        if (!user) {
          // If the user with the given ID doesn't exist, return a 404 response
          return res.status(404).json({ error: 'User not found' });
        }
  
        // If the user exists, delete it
        user.destroy()
          .then(() => {
            // Send a 204 (No Content) response to indicate successful deletion
            res.status(204).end();
          })
          .catch(error => {
            // Handle any errors that occur during deletion
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(error => {
        // Handle any errors that occur during database retrieval
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
}
