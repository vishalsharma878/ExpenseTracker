
const form = document.getElementById('my-form');
const token = localStorage.getItem('token');

let isCreate = true;

form.addEventListener('submit', storeData);

function storeData(e) {
    e.preventDefault();

    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;


    let obj = {
        amount: amount,
        description: description,
        category: category
    }


   
    axios.post('http://localhost:3000/expense', obj, {headers: {"Authorization": token}})
        .then(res => {
            appendDataToList(amount, description, category, res.data.id);
           console.log(res.data.id)})
        .catch(err => alert(err));
   

    

    form.reset();
}

// Function to append data to the list
function appendDataToList(amount, description, category, id) {
    let li = document.createElement('li');
    const expenseData = document.getElementById('expenseData')
    li.innerHTML = `
        <strong>Amount:</strong> $${amount}, 
        <strong>Description:</strong> ${description}, 
        <strong>Category:</strong> ${category}
    `;

    // Delete button
    let button = document.createElement('button');
    button.appendChild(document.createTextNode('Delete'))
    button.addEventListener('click', function () {
        expenseData.removeChild(li);
        axios.delete(`http://localhost:3000/delete/${id}`, {headers: {"Authorization": token}})
        .then((mesg) => alert(mesg.data.message))
        .catch(err => console.log(err));
        
    });

    li.appendChild(button);
    // li.appendChild(edit);
   
    expenseData.appendChild(li);
}

const buyPremiumButton = document.getElementById('buyPremiumButton');
const premiumUser = document.getElementById('premium-status');
const leaderBoard = document.getElementById('leader-board');
let checkPremium = false;
leaderBoard.addEventListener('click', () =>{
    checkPremiumStatus();
    if(checkPremium){
        window.location.href = '/views/leader-board.html'
    }
    else{
        alert("This Feature is for Premium User");
    }
})
//Check if the user is premium user or not
function checkPremiumStatus(){
    axios.get('http://localhost:3000/premium/check-status', {headers: {
        "Authorization": token
    }})
    .then((res) => {
        if(res.data){
            checkPremium = true;
            buyPremiumButton.style.display = 'none';
            premiumUser.style.display = 'block';
            leaderBoard.style.display = 'block';
        }
        else{
            buyPremiumButton.style.display = 'block';
        }
    }).catch (err  => {
        console.error(err);
    })
}

//Buy Premium Button
buyPremiumButton.onclick = async function(e){
  const res = await axios.get('http://localhost:3000/premiummembership', {headers: {
    "Authorization": token
}})
let options = {
    "key": res.data.key_id,
    "order_id": res.data.order.id,
    "handler": async function (res){
       await axios.post('http://localhost:3000/purchase/updatestatus', {order_id: options.order_id, payment_id: res.razorpay_payment_id}, {headers: {"Authorization": token}})
        alert("You are now Premium user")
        checkPremiumStatus();
    },
    
};

const rzpl = new Razorpay(options);
rzpl.open();
e.preventDefault();

rzpl.on('payment.failed', function(res){
    alert("Something went wrong")
})
}

checkPremiumStatus();
// Get Data

axios.get('http://localhost:3000/expense/get', {headers: {
    "Authorization": token
}})
    .then(res => printData(res.data))
    .catch(err => alert(err));
 
function printData(obj) {
    for (let i = 0; i < obj.length; i++) {

        const d = obj[i];
        appendDataToList(d.expenseAmount, d.description, d.category, d.id);
    }
}
