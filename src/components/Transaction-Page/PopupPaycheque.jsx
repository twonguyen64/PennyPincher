import { onMount, createSignal } from 'solid-js'
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'
import { useMoney } from '../../contexts/MoneyContext'
import { TRANSACTIONS_STORE } from '../../utils/db'
import { getObjectFromCheckbox } from '../../utils/util-functions'
import usePopup from '../../utils/Popup'


export default function PopupPaycheque() {
    const { exitPopup } = usePopup()
    const { editMode, setCheckboxCount } = useMainWrapperContext();
    const { 
        transactions, addTransaction, editTransaction, 
        changeAllowance, payFreq, totalBudgetCost,
    } = useMoney();

    const [prevIncomeAmount, setPrevIncomeAmount] = createSignal(0);
    let incomeRef;
    let headerString, submitButtonString;
    if (!editMode()) {
        headerString = 'Add Paycheque'
        submitButtonString = 'Add paycheque'
    } else {
        headerString = 'Edit Paycheque'
        submitButtonString = 'Save'
    }

    onMount(() => {
        if (editMode()) initalizeEditMode();
    });

    const initalizeEditMode = () => {
        const transaction = getObjectFromCheckbox(transactions())
        incomeRef.value = transaction.income
        setPrevIncomeAmount(transaction.income)
    }

    const submit = () => {
        if (!editMode()) addPaycheque();
        else editPaycheque();
    }

    const addPaycheque = () => {
        const incomeAmount = parseInt(incomeRef.value)
        if (incomeAmount <= 0 || isNaN(incomeAmount)) {
            alert('Please enter a valid amount'); return
        }

        const allowanceAmount = incomeAmount - totalBudgetCost()
        const newTransaction = {
            date: new Date().toISOString().split('T')[0],
            name: 'Pay',
            tag: 'PAYCHEQUE',
            income: incomeAmount,
            expense: totalBudgetCost()
        }

        addTransaction(newTransaction, TRANSACTIONS_STORE);
        changeAllowance(allowanceAmount);
        exitPopup()
    }

    const editPaycheque = () => {
        const incomeAmount = parseInt(incomeRef.value)
        if (incomeAmount <= 0 || isNaN(incomeAmount)) {
            alert('Please enter a valid amount'); return
        }

        const changeInBalance = incomeAmount - prevIncomeAmount()
        const editedTransaction = {
            ...getObjectFromCheckbox(transactions()),
            income: incomeAmount,
        }

        editTransaction(editedTransaction, TRANSACTIONS_STORE)
        changeAllowance(changeInBalance);
        
        document.querySelector('.editModeCheckbox:checked').checked = false
        setCheckboxCount(0)
        exitPopup()
    }

    return (
        <div class="popup-wrapper">
            <div class="popup">
                <h3 class='popupfield alignleft'>{headerString}</h3>
                <div class='popupfield centered'>
                    <span>Earnings:</span>
                    <span>$
                        <input 
                        class='moneyInput'
                        type='number'
                        ref={incomeRef}
                        />
                    </span>
                </div>
                <Show when={totalBudgetCost() > 0}>
                    <span class='popupfield alignleft'>
                        Per your budget sheet, <br/> the following will be deducted:
                    </span>
                    <div id='addPaycheque-budgetExpenseDisplay'>
                        <span>{payFreq().string} expenses:</span>
                        <span 
                            id='addPaycheque-budgetExpenseDisplay-amount'
                        >– ${totalBudgetCost()}</span>
                    </div>
                </Show>
                <div class='popupfield spaced'>
                    <button onClick={exitPopup}>Cancel</button>
                    <button onClick={submit}>{submitButtonString}</button>
                </div>
            </div>
        </div>
    )
}