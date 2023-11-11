const token  = localStorage.getItem('token');
document.addEventListener("DOMContentLoaded", () => {
    const dateFilter = document.getElementById("dateFilter");
    const downloadButton = document.getElementById("downloadButton");


    
    dateFilter.addEventListener("change", () => {
        const selectedDateRange = dateFilter.value;
        
        updateData(selectedDateRange);
    });

    
    downloadButton.addEventListener("click", () => {
    
        downloadExpenses();
    });

    
    updateData("daily");
});

async function updateData(dateRange) {
    try {
        
        const response = await axios.get(`http://localhost:3000/expenses/for-report/${dateRange}`, {headers: {"Authorization": token}});

        const data = response.data;

        const expenseTable = document.getElementById("expenseTable");
        expenseTable.innerHTML = "";
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
            </tr>
        `;
        expenseTable.appendChild(thead);
       
         data.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${entry.createdAt}</td><td>${entry.expenseAmount}</td><td>${entry.description}</td><td>${entry.category}</td>`;
            expenseTable.appendChild(row);
        });
    } catch (error) {
        // Handle errors, e.g., display an error message
        console.error(error.message);
    }
}

async function downloadExpenses() {
    try {
        
        const response = await axios.get("http://localhost:3000/expenses/download", {headers: {"Authorization": token}});

        
        const csvData = response.data;


        // Create a temporary download link and trigger the download
         const downloadLink = document.createElement("a");
        downloadLink.href = csvData.fileURL;
        downloadLink.download = "expenses.csv";
        downloadLink.click();
    } catch (error) {
        
        console.error(error.message);
    }
}

async function getExpensesUrls(){
    try {
        
        const response = await axios.get(`http://localhost:3000/expenses/file-urls`, {headers: {"Authorization": token}});

        const data = response.data;

        const urlTable = document.getElementById("url");
        urlTable.innerHTML = "";
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>S.No.</th>
                <th>Previous Downloaded Urls</th>
                
            </tr>
        `;
        urlTable.appendChild(thead);
        let sNo = 1;
         data.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${sNo}</td><td>${entry.url}</td>`;
            sNo++;
            urlTable.appendChild(row);
        });
    } catch (error) {
        // Handle errors, e.g., display an error message
        console.error(error.message);
    } 
}

getExpensesUrls();

