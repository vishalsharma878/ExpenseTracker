const form = document.getElementById('my-form');

let isCreate = true;

form.addEventListener('submit', storeData);

function storeData(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;


    let obj = {
        email: email,
        amount: amount,
        description: description,
        category: category
    }


   
    axios.post('http://localhost:3000/expense', obj)
        .then(res => {
            appendDataToList(email, amount, description, category, res.data.id);
           console.log(res.data.id)})
        .catch(err => alert(err));
   

    

    form.reset();
}

// Function to append data to the list
function appendDataToList(email, amount, description, category, id) {
    let li = document.createElement('li');
    li.innerHTML = `
        <strong>Email:</strong> ${email}, 
        <strong>Amount:</strong> $${amount}, 
        <strong>Description:</strong> ${description}, 
        <strong>Category:</strong> ${category}
    `;

    // Delete button
    let button = document.createElement('button');
    button.appendChild(document.createTextNode('Delete'))
    button.addEventListener('click', function () {
        form.removeChild(li);
        axios.delete(`http://localhost:3000/delete/${id}`)
        .then(() => console.log("Item deleted succesfully"))
        .catch(err => console.log(err));
        
    });

    // Edit button
    // let edit = document.createElement('button');
    // edit.innerText = 'Edit';
    // edit.addEventListener('click', function () {
    //     document.getElementById('email').value = email;
    //     document.getElementById('amount').value = amount;
    //     document.getElementById('description').value = description;
    //     document.getElementById('category').value = category;
    //     form.removeChild(li);
        
    // });

    li.appendChild(button);
    // li.appendChild(edit);

    form.appendChild(li);
}

// Get Data
axios.get('http://localhost:3000/expense/get')
    .then(res => printData(res.data))
    .catch(err => alert(err));
 
function printData(obj) {
    for (let i = 0; i < obj.length; i++) {

        const d = obj[i];
        appendDataToList(d.email, d.expenseAmount, d.description, d.category, d.id);
    }
}
