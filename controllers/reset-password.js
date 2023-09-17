const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const User = require('../models/user');


async function forgotpassword(req, res){
    try{
    const email = req.body.email;
    const user = await User.findOne({where: {email: email}});
    
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    
    apiKey.apiKey = process.env.API_KEY
    
    const tranEmail = new Sib.TransactionalEmailsApi()
    
    
    const sender = {
        email: '****',
    
    }
    
    const receviers = [
        {
            email: user.email,
        },
    ]
    
    tranEmail.sendTransacEmail({
        sender,
        to: receviers,
        subject: 'Reset your password',
        textContent: `Please click this is from original`,
    })
    res.json({message: "Reset Password Link Sent"})
  }
  catch(err){
    console.log(err);
    res.json({message: "Email Not Found"});
  }
}


module.exports = {
   forgotpassword
}