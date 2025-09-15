import { onMount, createSignal } from 'solid-js'
import usePopup from '../../utils/Popup';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext';
import { useMoney } from '../../contexts/MoneyContext';
import { BUDGET_STORE } from '../../utils/db';
import { getObjectFromCheckbox } from '../../utils/util-functions'
import TagChooser from '../TagChooser';

export default function PopupBudget() {
    const { exitPopup } = usePopup()
    const { editMode, setCheckboxCount } = useMainWrapperContext();
    const { budgetExpenses, addTransaction, editTransaction } = useMoney();
    const [popupTitle, setPopupTitle] = createSignal('New budget expense');
    const [submitButtonText, setSubmitButtonText] = createSignal('Add expense');
    let TagChooserRef, nameRef, costRef, freqRef

    onMount(() => {
        if (editMode()) initalizeEditMode()
    });

    const initalizeEditMode = () => {
        const expense = getObjectFromCheckbox(budgetExpenses())
        nameRef.value = expense.name
        costRef.value = expense.cost
        freqRef.value = expense.freq
        if (expense.tag != '') {
            for (const tag of TagChooserRef.children)
                if (tag.textContent === expense.tag) tag.classList.add('selected')
        }
        setPopupTitle('Edit budget expense')
        setSubmitButtonText('Done')
    }

    const submit = () => {
        if (costRef.value === '') {
            alert('Enter a cost'); return
        }
        if (nameRef.value === '') {
            alert('Enter a name for the expense'); return
        }
        const tagElement = TagChooserRef.querySelector('.selected')
        const tag = (tagElement) ? tagElement.textContent : ''
        const cost = parseInt(costRef.value)
        const freqArr = {
            1: 'per day',
            7: 'per week',
            30: 'per month'
        }
        const newBudgetExpense = {
            name: nameRef.value,
            tag: tag,
            cost: cost,
            freq: parseInt(freqRef.value),
            freqStr: freqArr[freqRef.value],
        }
        if (editMode()) {
            newBudgetExpense.id = getObjectFromCheckbox(budgetExpenses()).id
            editTransaction(newBudgetExpense, BUDGET_STORE)
            document.querySelector('.editModeCheckbox:checked').checked = false
            setCheckboxCount(0)
        }
        else {
            addTransaction(newBudgetExpense, BUDGET_STORE)
        }
        exitPopup()
    }

    return (
        <div class="popup-wrapper">
            <div class="popup">
                <h3>{popupTitle()}</h3>
                
                
                <div class='popupfield spaced'>
                    <label for="transactionName">Name:</label>
                    <input
                        id="transactionName"
                        type="text"
                        ref={nameRef}
                    />
                </div>
                
                <TagChooser ref={TagChooserRef} hasAddFunctionality={true}/>
                
                <div class='popupfield spaced'>
                    <span>Cost:</span>
                    <span>
                        <span>$
                            <input 
                            class='moneyInput' 
                            type='number'
                            placeholder={0}
                            ref={costRef}/>
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <select name="freq" ref={freqRef}>
                            <option value={1}>per day</option>
                            <option value={7}>per week</option>
                            <option value={30}>per month</option>
                        </select>
                    </span>
                </div>
                <div class='popupfield spaced'>
                    <button type="button" onClick={exitPopup}>Cancel</button>
                    <button onClick={submit}>{submitButtonText()}</button>
                </div>
                
            </div>
        </div>
    );
}