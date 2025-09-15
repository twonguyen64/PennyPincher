import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { useMoney } from '../../contexts/MoneyContext';
import { TRANSACTIONS_STORE, BUDGET_STORE } from "../../utils/db";

export default function PopupDelete(props) {
    const { setShowPopup, setEditMode } = useMainWrapperContext();
    const { deleteTransaction, transactions, changeAllowance} = useMoney();

    const deleteSelectedExpenses = () => {
        let listRef
        if (document.getElementById('TransactionList'))
            listRef = document.getElementById('TransactionList')
        else if (document.getElementById('BudgetList'))
            listRef = document.getElementById('BudgetList')


        const checkboxes = listRef.querySelectorAll('.editModeCheckbox:checked');
        for (const checkbox of checkboxes) {
            const objectContainer = checkbox.closest('.ObjectContainer')
            const objectID = parseInt(objectContainer.getAttribute('objectID'), 10)

            //Adjust allowance() accordingly
            if (props.store === TRANSACTIONS_STORE) {
                const transaction = transactions().find(object => object.id === objectID)
                const revertBalance = -1 * (transaction.income - transaction.expense)
                changeAllowance(revertBalance)
            }

            deleteTransaction(objectID, props.store)
        }
        setEditMode(false);
        setShowPopup('');
    };
    
    return (
       
                <div class="popup">
                    <p>Are you sure you want to delete these items?</p>
                    <div class='popupfield spaced'>
                        <button onClick={() => setShowPopup('')}>Cancel</button>
                        <button onClick={() => deleteSelectedExpenses()}>Delete</button>
                    </div>
                </div>
    );
}