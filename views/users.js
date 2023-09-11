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
    axios.post('http://localhost:3000/user/signup', signupFormData)
    .then(res => console.log(res.data))
    .catch(err => alert("User already exist"));
})

const login  = document.getElementById('login');

login.addEventListener('submit', function(e) {
    e.preventDefault();
    signup = false;
    const loginFormData = getSignUpLoginData();
    login.reset();
    axios.post('http://localhost:3000/user/login', loginFormData)
    .then(res => {
        alert(res.data.message);
        localStorage.setItem('token', res.data.token)
        window.location.href = 'http://127.0.0.1:5500/views/expense.html';
    })
    .catch(err => alert(err.response.data.message));

})