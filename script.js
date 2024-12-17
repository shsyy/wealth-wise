document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('explore-btn');
    const backBtn = document.getElementById('back-btn');
    const introPage = document.getElementById('intro-page');
    const transactionPage = document.getElementById('transaction-page');
    const transactionForm = document.getElementById('transaction-form');
    const transactionType = document.getElementById('transaction-type');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('date');
    const transactionTableBody = document.getElementById('transaction-table-body');
    const balanceEl = document.getElementById('balance'); // Update ID to balance
    const searchInput = document.getElementById('search');
    const filterType = document.getElementById('filter-type');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || []; // Load saved transactions

    // Show Transaction Manager Page
    exploreBtn.addEventListener('click', () => {
        introPage.classList.add('hidden');
        transactionPage.classList.remove('hidden');
    });

    // Go Back to Introduction Page
    backBtn.addEventListener('click', () => {
        transactionPage.classList.add('hidden');
        introPage.classList.remove('hidden');
    });

    // Function to save transactions to localStorage
    const saveTransactions = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    // Function to render transactions in the table
    const renderTransactions = () => {
        transactionTableBody.innerHTML = ''; // Clear the table
        let balance = 0; // Calculate total balance

        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.type}</td>
                <td>$${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="editTransaction(${index})" class="edit-btn">Edit</button>
                    <button onclick="deleteTransaction(${index})" class="delete-btn">Delete</button>
                </td>
            `;
            transactionTableBody.appendChild(row);

            // Calculate balance based on transaction type
            if (transaction.type === 'Income') {
                balance += parseFloat(transaction.amount);
            } else {
                balance -= parseFloat(transaction.amount);
            }
        });

        balanceEl.textContent = balance.toFixed(2); // Update balance display
    };

    // Function to add a new transaction
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTransaction = {
            type: transactionType.value,
            amount: parseFloat(amountInput.value),
            category: categoryInput.value,
            date: dateInput.value
        };

        transactions.push(newTransaction);
        saveTransactions();
        renderTransactions();

        // Clear input fields
        transactionForm.reset();
    });

    // Function to delete a transaction
    window.deleteTransaction = (index) => {
        transactions.splice(index, 1); // Remove the transaction at the given index
        saveTransactions();
        renderTransactions();
    };

    // Function to edit a transaction
    window.editTransaction = (index) => {
        const transaction = transactions[index];

        // Prefill the form with existing data
        transactionType.value = transaction.type;
        amountInput.value = transaction.amount;
        categoryInput.value = transaction.category;
        dateInput.value = transaction.date;

        // Remove the old transaction after editing
        deleteTransaction(index);
    };

    // Function to filter transactions
    filterType.addEventListener('change', () => {
        const typeFilter = filterType.value;
        const filteredTransactions = typeFilter === 'All'
            ? transactions
            : transactions.filter(t => t.category === typeFilter || (typeFilter === 'None' && t.category === 'None'));
    
        renderFilteredTransactions(filteredTransactions);
    });
    
    // Function to search transactions
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredTransactions = transactions.filter(t =>
            t.category.toLowerCase().includes(searchValue)
        );

        renderFilteredTransactions(filteredTransactions);
    });

    // Helper function to render filtered transactions
    const renderFilteredTransactions = (filteredTransactions) => {
        transactionTableBody.innerHTML = ''; // Clear the table
        filteredTransactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.type}</td>
                <td>$${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="editTransaction(${index})" class="edit-btn">Edit</button>
                    <button onclick="deleteTransaction(${index})" class="delete-btn">Delete</button>
                </td>
            `;
            transactionTableBody.appendChild(row);
        });
    };

    // Initial rendering of transactions
    renderTransactions();
});
