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
        axios.delete(`http://localhost:3000/delete/${id}`)
        .then(() => console.log("Item deleted succesfully"))
        .catch(err => console.log(err));
        
    });

    li.appendChild(button);
    // li.appendChild(edit);
   
    expenseData.appendChild(li);
}

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
