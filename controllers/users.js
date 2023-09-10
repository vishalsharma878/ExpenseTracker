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

async function loginCheck(req, res){
  try{
    const email = req.body.email;
    const password = req.body.password;

    const userRecord = await user.findOne({
      where: { email: email }
    });

    if (!userRecord) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await user.findOne({
      where: {password: password}
    })

    if (!passwordMatch) {

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } 
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
    userData,
    loginCheck
}   