
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  forgotPasswordForm.addEventListener('submit', async function (event) {
    try{
    event.preventDefault(); 
    const email = document.getElementById('forgotEmail').value;
     
    const sendEmail = {email: email};
    forgotPasswordForm.reset();
    const reset  =  await axios.post('http://13.233.147.197:3000/password/forgotpassword', sendEmail);
    alert(reset.data.message);
    }
    
    catch(err){
      console.log(err)
    }
    
  });
