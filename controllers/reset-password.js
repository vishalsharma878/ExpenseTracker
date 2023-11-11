const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPassword = require('../models/forgot-password');


async function forgotpassword(req, res){
    try{
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if(user){
        const id  = uuid.v4();
    await ForgotPassword.create({_id: id, active: true, userId: user.id})
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    
    apiKey.apiKey = process.env.API_KEY
    
    const tranEmail = new Sib.TransactionalEmailsApi()
    
    
    const sender = {
        email: 'dilanaam600@gmail.com',
    
    }
    
    const receviers = [
        {
            email: user.email,
        },
    ]

     await tranEmail.sendTransacEmail({
        sender,
        to: receviers,
        subject: 'Reset your password',
        textContent: `Please click this is from original`,
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
    })
    res.json({message: "Reset Password Link Sent"})
}
else{
    res.json({message: "User Not Found"})
}

}
catch(err){
    console.log(err);
    return res.json({ message: "Something Went Wrong"});
  }
  
}


async function resetpassword(req, res){
    
    const id =  req.params.id;
    const forgotpasswordrequest = await ForgotPassword.findOne({_id: id });
        if(forgotpasswordrequest){
            forgotpasswordrequest.updateOne({ active: false});
            res.status(200).send(`<!DOCTYPE html>
               
                                    <title>Reset Password</title>
                                   
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    </head>
                                    <body>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset Password</button>
                                    </form>
                                    </body>
                                </html>`
                                )
            res.end()

        }
   
}


async function updatepassword (req, res){
    try {
        const { newpassword } = req.query;
        const { id } = req.params;
       const resetpasswordrequest = await ForgotPassword.findOne({ _id: id });
       const user = await User.findOne({ _id : resetpasswordrequest.userId });
            if(user) {

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.updateOne({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
           
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

module.exports = {
   forgotpassword,
   resetpassword,
   updatepassword
}