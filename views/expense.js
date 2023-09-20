
const form = document.getElementById('my-form');
const token = localStorage.getItem('token');

let isCreate = true;

form.addEventListener('submit', storeData);

 async function storeData(e) {
    e.preventDefault();

    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;


    let obj = {
        amount: amount,
        description: description,
        category: category
    }

   try{
   
   const res = await axios.post('http://localhost:3000/expense', obj, {headers: {"Authorization": token}})
        
    appendDataToList(amount, description, category, res.data.id);

    }
    catch(err){
       alert(err.response.error);
    }
    

    form.reset();
}

// Function to append data to the list
const expenseData = document.getElementById('expenseData')
function appendDataToList(amount, description, category, id) {

    
    const row = document.createElement('div');
        row.classList.add('expenses-row');

        const positionCol = document.createElement('div');
        positionCol.classList.add('amount-col');
        positionCol.textContent = amount;

        const nameCol = document.createElement('div');
        nameCol.classList.add('description-col');
        nameCol.textContent = description;

        const totalExpenseCol = document.createElement('div');
        totalExpenseCol.classList.add('category-col');
        totalExpenseCol.textContent = category;

        const button = document.createElement('button');
        button.classList.add('button');
        button.textContent = 'Delete';

        row.appendChild(positionCol);
        row.appendChild(nameCol);
        row.appendChild(totalExpenseCol);
        row.appendChild(button);

    // Delete button
    button.addEventListener('click', function () {
        expenseData.removeChild(row);
        axios.delete(`http://localhost:3000/delete/${id}`, {headers: {"Authorization": token}})
        .then((mesg) => alert(mesg.data.message))
        .catch(err => console.log(err));
        
    });

    
    
   
    expenseData.appendChild(row);
}

const buyPremiumButton = document.getElementById('buyPremiumButton');
const premiumUser = document.getElementById('premium-status');
const leaderBoard = document.getElementById('leader-board');
const report = document.getElementById('report');


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

report.addEventListener('click', () =>{
    checkPremiumStatus();
    if(checkPremium){
        window.location.href = '/views/report.html'
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

const chooseExpenses = document.getElementById('ChooseExpenses');
chooseExpenses.addEventListener('change', () => {
    const value = chooseExpenses.value;
    localStorage.setItem('chooseExpense', value);
})
let chooseExpense = localStorage.getItem('chooseExpense');
if(!chooseExpense){
    chooseExpense = 10;
}

function showPagination({currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage}){
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if(hasPreviousPage) {
        const btn1 = document.createElement('button');
        btn1.innerHTML = previousPage
        btn1.addEventListener('click', () => paginationExpenses(previousPage ))
        pagination.appendChild(btn1);
    }

    const btn2 = document.createElement('button');
    btn2.innerHTML = `<h3>${currentPage}</h3>`;
    btn2.addEventListener('click', () => paginationExpenses(currentPage))
    pagination.appendChild(btn2);
    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => paginationExpenses(nextPage))
        pagination.appendChild(btn3); 
    }
}
function paginationExpenses(page){
    axios.get(`http://localhost:3000/expense/get/${page}/${chooseExpense}`, {headers: {
    "Authorization": token
}})
    .then(res => {
        printData(res.data.expenses)
        showPagination(res.data);
    })
    .catch(err => alert(err));

}
// Get Data
document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    
axios.get(`http://localhost:3000/expense/get/${currentPage}/${chooseExpense}`, {headers: {
    "Authorization": token
}})
    .then(res => {
        printData(res.data.expenses)
        showPagination(res.data);
    })
    .catch(err => alert(err));
})

function printData(obj) {
    expenseData.innerHTML = '';
    for (let i = 0; i < obj.length; i++) {

        const d = obj[i];
        appendDataToList(d.expenseAmount, d.description, d.category, d.id);
    }
}

