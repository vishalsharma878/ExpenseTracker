async function getDataForLeaderBoard() {
    const res = await axios.get('http://localhost:3000/premium/leader-board')

    const leaderboardContainer = document.getElementById('leaderboard-data');
    const obj = res.data;
    let position = 1;
    for (let i = 0; i < obj.length; i++) {
        const data = obj[i];
        const row = document.createElement('div');
        row.classList.add('leaderboard-row');

        const positionCol = document.createElement('div');
        positionCol.classList.add('position-col');
        positionCol.textContent = position;

        const nameCol = document.createElement('div');
        nameCol.classList.add('name-col');
        nameCol.textContent = data.name;

        const totalExpenseCol = document.createElement('div');
        totalExpenseCol.classList.add('total-expense-col');
        totalExpenseCol.textContent = data.totalExpense;

        row.appendChild(positionCol);
        row.appendChild(nameCol);
        row.appendChild(totalExpenseCol);

        leaderboardContainer.appendChild(row);
        position++;

    }

}
getDataForLeaderBoard();   