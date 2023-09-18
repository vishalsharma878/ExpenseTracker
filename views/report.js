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
        
        const response = await axios.get(`/api/expenses?dateRange=${dateRange}`);

        // Handle the API response data
        const data = response.data;

        // Clear previous data if any
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
            row.innerHTML = `<td></td><td></td><td></td><td></td>`;
            expenseTable.appendChild(row);
        });
    } catch (error) {
        // Handle errors, e.g., display an error message
        console.error(error.message);
    }
}

async function downloadExpenses() {
    try {
        
        const response = await axios.get("/api/expenses/download");

        
        const csvData = response.data;

        // Create a blob from the CSV data
        const blob = new Blob([csvData], { type: "text/csv" });

        // Create a temporary download link and trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = "expenses.csv";
        downloadLink.click();
    } catch (error) {
        
        console.error(error.message);
    }
}
