import { createEffect } from "solid-js";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { useMoney } from '../../contexts/MoneyContext';


import TransactionEditable from "./TransactionEditable";

export default function EditPopup(props) {
    const { showPopup, setShowPopup, setCheckboxCount } = useMainWrapperContext();
    const { moneyIn, moneyOut, setMoneyIn, setMoneyOut } = useMoney();

    let transactions, setTransactions, depositType, blurRef
    switch (props.type) {
        case 'income':
            transactions = moneyIn
            setTransactions = setMoneyIn
            break;
        default:
            transactions = moneyOut
            setTransactions = setMoneyOut
    }

     createEffect(() => {
        if (showPopup() === 'edit') {
            if (blurRef) blurRef.classList.add('blur');
        } 
    });

    const listRef = document.getElementById('TransactionList-lower-wrapper')
    const transactionCheckbox = listRef.querySelector('input[type="checkbox"]:checked')
    const transaction = transactions()[transactionCheckbox.getAttribute('index')]
    
    switch (props.type) {
        case 'income':
            if (transaction.amount == 0 || isNaN(transaction.amount))
                depositType = 'Savings deposit (from allowance)'
            else depositType = 'Income'
            break;
        default:
            if (transaction.amount == 0 || isNaN(transaction.amount))
                depositType = 'Savings withdrawl'
            else depositType = 'Expense'
    }
    
    const editTransaction = () => {
        const nameInput = document.getElementById('Editable-Transaction-name')
        const amountInput = document.getElementById('Editable-Transaction-amount')
        const savingsInput = document.getElementById('Editable-Transaction-savings')
        if (nameInput) transaction.name = nameInput.value
        if (amountInput) transaction.amount = amountInput.value
        if (savingsInput) transaction.savings = savingsInput.value

        setTransactions(prevEntry => {
            return prevEntry.map(entry => {
            if (entry === transaction) {
                return {
                ...entry,
                name: nameInput.value,
                amount: parseInt(amountInput.value),
                savings: parseInt(savingsInput.value),
                date: transaction.date
                };
            }
            return entry;
            });
        });
        transactionCheckbox.checked = false
        setCheckboxCount(0)
        setShowPopup('');
    }

    return (
        <div>
            <div id='background-blur-grid' ref={blurRef}></div>
            <div id='background-grid'>
                <div></div>
                <div class="fullscreen-popup-wrapper">
                    <div class="fullscreen-popup" id="edit-popup">
                        <h3>Edit Transaction</h3>
                        <div class='Transaction-header'>
                            <span>Name / Tag</span>
                            <span>Amount</span>
                            <span>Savings Deposit</span>
                        </div>
                        <TransactionEditable
                            type={props.type}
                            name={transaction.name}
                            amount={transaction.amount} 
                            savings={transaction.savings}
                        />
                        <div class='depositType'>Deposit type: <b>{depositType}</b></div>
                        <div class='transactionField spaced'>
                            <button onClick={() => setShowPopup('')}>Cancel</button>
                            <button onClick={editTransaction}>Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}