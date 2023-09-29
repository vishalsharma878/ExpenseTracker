const form = document.getElementById('signupForm');
let signup = false;

function getSignUpLoginData(){
    const signUpFormValues = {};
    if(signup){
    const formElements = document.forms[0].elements;
    for(let i =0; i<formElements.length; i++){
        const element = formElements[i];
        if(element.type !== 'submit'){
            signUpFormValues[element.name] = element.value;
        } 
    }
  }
  else{
    const formElements = document.forms[1].elements;
    for(let i =0; i<formElements.length; i++){
        const element = formElements[i];
        if(element.type !== 'submit'){
            signUpFormValues[element.name] = element.value;
        } 
    }
  }
    return signUpFormValues;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    signup = true;
    const signupFormData = getSignUpLoginData();
    form.reset();
    axios.post('http://35.154.167.41:3000/user/signup', signupFormData)
    .then(res => console.log(res.data))
    .catch(err => alert("User already exist"));
})

const login  = document.getElementById('loginForm');

login.addEventListener('submit', async function (e) {
    e.preventDefault();
    signup = false;
    const loginFormData = getSignUpLoginData();
    login.reset();
    
    try {
        const res = await axios.post('http://35.154.167.41:3000/user/login', loginFormData);
        alert(res.data.message);
        
        localStorage.setItem('token', res.data.token);
        window.location.href = '/expense.html';
        console.log("after" +res.data);
    }
     catch (err) {
        alert(err.response.data.message);
    }
    
});