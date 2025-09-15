import { onMount, createSignal } from 'solid-js'
import usePopup from '../../utils/Popup'
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'
import { useMoney } from '../../contexts/MoneyContext'
import { TRANSACTIONS_STORE } from '../../utils/db'
import { getObjectFromCheckbox } from '../../utils/util-functions'

import AccountDisplay from '../AccountDisplay';
import TagChooser from '../TagChooser';

export default function PopupExpense() {
    const { exitPopup } = usePopup();
    
    const { setCheckboxCount, editMode } = useMainWrapperContext();
    const { 
        transactions, addTransaction, editTransaction, 
        allowance, changeAllowance 
    } = useMoney();

    const [prevExpenseAmount, setPrevExpenseAmount] = createSignal(0);
    let nameRef, expenseRef, TagChooserRef;
    let headerString, submitButtonString;
    if (!editMode()) {
        headerString = 'Add Expense'
        submitButtonString = 'Add expense'
    } else {
        headerString = 'Edit Expense'
        submitButtonString = 'Save'
    }

    onMount(() => {
        if (editMode()) initalizeEditMode();
    });

    const initalizeEditMode = () => {
        const transaction = getObjectFromCheckbox(transactions())
        nameRef.value = transaction.name
        expenseRef.value = transaction.expense
        setPrevExpenseAmount(transaction.expense);
        
        if (transaction.tag != '') {
            for (const tag of TagChooserRef.children)
                if (tag.textContent === transaction.tag) tag.classList.add('selected')
        }
    }

    const submit = () => {
        if (!editMode()) addExpense();
        else editExpense();
    }
    const addExpense = () => {
        const expenseAmount = parseInt(expenseRef.value)
        if (expenseAmount <= 0 || isNaN(expenseAmount)) {
            alert('Please enter a valid amount'); return
        }

        const name = nameRef.value || ''
        const tagElement = TagChooserRef.querySelector('.selected')
        const tag = (tagElement) ? tagElement.textContent : ''

        const newTransaction = {
            date: new Date().toISOString().split('T')[0],
            name: name,
            tag: tag,
            income: 0,
            expense: expenseAmount,
        }
        addTransaction(newTransaction, TRANSACTIONS_STORE)
        changeAllowance(-1 * expenseAmount);
        exitPopup()
    }

    const editExpense = () => {
        const expenseAmount = parseInt(expenseRef.value)
        if (expenseAmount <= 0 || isNaN(expenseAmount)) {
            alert('Please enter a valid amount'); return
        }

        const name = nameRef.value || ''
        const tagElement = TagChooserRef.querySelector('.selected')
        const tag = (tagElement) ? tagElement.textContent : ''

        const editedTransaction = {
            ...getObjectFromCheckbox(transactions()),
            name: name,
            tag: tag,
            income: 0,
            expense: expenseAmount,
        }
        editTransaction(editedTransaction, TRANSACTIONS_STORE)
        
        const changeInBalance = prevExpenseAmount() - expenseAmount
        changeAllowance(changeInBalance);
        
        document.querySelector('.editModeCheckbox:checked').checked = false
        setCheckboxCount(0)
        exitPopup()
    }
    
    return (
        <div class='popup-wrapper'>
            <div class='popup'>
                <h3 class='popupfield alignleft'>{headerString}</h3>
                
                <AccountDisplay colorFor="allowance" name="Allowance" balance={allowance()}/>
                
                <div class='popupfield spaced'>
                    <label for="transactionName">Name:</label>
                    <input
                        id="transactionName"
                        type="text"
                        ref={nameRef}
                    />
                </div>

                <TagChooser ref={TagChooserRef} hasAddFunctionality={true}/>
                
                <div class='popupfield centered'>
                    <span>Amount:</span>
                    <span>$
                        <input 
                        class='moneyInput'
                        type='number'
                        ref={expenseRef}
                        />
                    </span>
                </div>

                <div class='popupfield spaced'>
                    <button onClick={exitPopup}>Cancel</button>
                    <button onClick={submit}>{submitButtonString}</button>
                </div>
            </div>
        </div>
    )
}