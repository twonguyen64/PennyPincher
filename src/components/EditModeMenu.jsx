import { Show, onMount, onCleanup } from "solid-js"
import { useMainWrapperContext } from "../contexts/MainWrapperContext"
import { useMoney } from "../contexts/MoneyContext"
import { getObjectFromCheckbox } from "../utils/util-functions"

import closeImg from '../assets/close-button.png'

export default function () {
    const { checkboxCount, setCheckboxCount, setShowPopup, setEditMode } = useMainWrapperContext();
    const { transactions } = useMoney();

    let listRef;
    if (document.getElementById('TransactionList'))
        listRef = document.getElementById('TransactionList')
    else if (document.getElementById('BudgetList'))
        listRef = document.getElementById('BudgetList')

    const checkboxBehaviour = (e) => {
        if (!e.target.classList.contains('ObjectContainer')) return
        const checkbox = e.target.querySelector('.editModeCheckbox')
        if (!checkbox) return
        checkbox.checked = (checkbox.checked) ? false : true

        const checkedBoxes = listRef.querySelectorAll('.editModeCheckbox:checked');
        const count = checkedBoxes.length || 0;
        setCheckboxCount(count);
    }

    onMount(() => {
        if (listRef) listRef.addEventListener('click', checkboxBehaviour);
    });
    onCleanup(() => {
        if (listRef) listRef.removeEventListener('click', checkboxBehaviour);
    });

    const determineList = () => {
        if (listRef.id === 'TransactionList') {
            determineTypeOfEdit(transactions())
        } 
        else if (listRef.id === 'BudgetList') {
            setShowPopup('budget')
        }
    }
    const determineTypeOfEdit = (objectArray) => {
        const transaction = getObjectFromCheckbox(objectArray)
        switch (transaction.tag) {
            case 'PAYCHEQUE':
                setShowPopup('paycheque')
                break;
            default:
                setShowPopup('expense')
        }
    };

    return (
        <div id="TransactionList-upper-wrapper" class="edit">
            <Show when={checkboxCount() === 1}>
                <div onClick={determineList} >Edit transaction</div>
            </Show>
            <Show when={checkboxCount() > 0}>
                <div onClick={() => setShowPopup('delete')}>Delete selected</div>
            </Show>
            <img class='close-button' src={closeImg} alt="X" onClick={() => setEditMode(false)}/>
        </div>
    );
}