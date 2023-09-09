const form = document.getElementById('signupForm');

function getSignUpData(){
    const signUpFormValues = {};

    const formElements = document.forms[0].elements;
    for(let i =0; i<formElements.length; i++){
        const element = formElements[i];
        if(element.type !== 'submit'){
            signUpFormValues[element.name] = element.value;
        } 
    }

    return signUpFormValues;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const signupFormData = getSignUpData();
    form.reset();
    axios.post('http://localhost:3000/user/signup', signupFormData)
    .then(res => console.log(res.data))
    .catch(err => alert("User already exist"));
})