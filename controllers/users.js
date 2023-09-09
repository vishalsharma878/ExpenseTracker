const user = require('../models/user')

async function userData(req, res){
    try{
      const userInfo = req.body;
      
      const newUser = await user.create(userInfo);
      res.status(201).json(newUser);
    }
    catch(error){
     console.log(error); // Log the actual error object for debugging
     res.status(500).json({ error: "Internal server error" }); 
    }
}

module.exports = {
    userData
}   