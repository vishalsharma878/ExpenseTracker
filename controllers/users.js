const bcrypt = require('bcrypt')
const user = require('../models/user')
const jwt = require('jsonwebtoken')

async function userData(req, res){
    try{
      const userInfo = req.body;
      const password = req.body.password;
      const hashPassword = await bcrypt.hash(password, 10);
      userInfo.password = hashPassword;
      
      const newUser = await user.create(userInfo);
      res.status(201).json(newUser);
    }
    catch(error){
     console.log(error); // Log the actual error object for debugging
     res.status(500).json({ error: "Internal server error" }); 
    }
}

function generateAccessToken(id) {
  return jwt.sign({userId: id}, process.env.JWT_TOKEN);
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

    const passwordMatch = await bcrypt.compare(password, userRecord.password);

    if (!passwordMatch) {

      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', token:  generateAccessToken(userRecord.id)});
  } 
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
    userData,
    loginCheck
}   