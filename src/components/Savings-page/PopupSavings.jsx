import { onMount, createSignal, Switch, Match, Show } from 'solid-js'
import { useMainWrapperContext } from '../../contexts/MainWrapperContext';
import { useMoney } from '../../contexts/MoneyContext';
import { GOALS_STORE } from '../../utils/db';
import { getObjectFromScroller, getDateFiveYearsFromNow } from '../../utils/util-functions'
import PopupInnerDelete from './PopupInnerDelete';

export default function PopupSavings() {
    const { editMode, setEditMode, setShowPopup } = useMainWrapperContext();
    const { goals, addTransaction, editTransaction, changeSavings } = useMoney();
    const [prevGoal, setPrevGoal] = createSignal(null);
    const [excessAmount, setExcessAmount] = createSignal(-1)

    let nameRef, targetRef, dateRef
    let headerString, submitButtonString;
    if (!editMode()) {
        headerString = 'Add savings goal'
        submitButtonString = 'Add goal'
    } else {
        headerString = 'Edit savings goal'
        submitButtonString = 'Save'
    }

    onMount(() => {
        if (editMode()) initalizeEditMode()
    });

    const initalizeEditMode = () => {
        const scroller = document.getElementById('Goals-scroller')
        const currentGoal = getObjectFromScroller(scroller, goals())
        setPrevGoal(currentGoal)
        nameRef.value = currentGoal.name
        targetRef.value = currentGoal.target
    }

    const submit = () => {
        /*Input checks*/
        if (nameRef.value === '') {
            alert('Enter a cost'); return
        }
        if (targetRef.value === '') {
            alert('Enter a name for the expense'); return
        }
        if (!editMode()) addGoal()
        else editGoalPart1()
    }

    const addGoal = () => {
        const newGoal = {
            dateStart: new Date().toISOString().split('T')[0],
            dateEnd: dateRef.value,
            name: nameRef.value,
            target: parseInt(targetRef.value),
            balance: 0,
            hasPaymentPlan: false
        }
        addTransaction(newGoal, GOALS_STORE)
        setShowPopup('')
    }

    const editGoalPart1 = () => {
        const newTargetValue = parseInt(targetRef.value)
        const excess = prevGoal().balance - newTargetValue
        if (excess >= 0) {
            setExcessAmount(excess)
            const inputSection = document.getElementById('Goal-popup-input-section')
            inputSection.classList.add('no-pointer-events')
            return
        }
        else editGoalPart2();
    }
    const editGoalPart2 = () => {
        const editedGoal = {
            ...prevGoal(),
            name: nameRef.value,
            target: parseInt(targetRef.value),
        }
        if (excessAmount() > 0) {
            editedGoal.balance = editedGoal.target
            changeSavings(excessAmount())
        }
        editTransaction(editedGoal, GOALS_STORE)
        setExcessAmount(-1);
        cancel();
    }
    const cancel = () => {
        setEditMode(false)
        setShowPopup('')
    }
    return (
        <div class='background'>
            <div class="popup-wrapper">
                <div class="popup">
                    <h3>{headerString}</h3>
                    <div id='Goal-popup-input-section'>
                    <div class='popupfield delete'>🗑️</div>
                    
                    
                    <div class='popupfield seperated'>
                        <label>Name:</label>
                        <input
                            type="text"
                            ref={nameRef}
                        />
                    </div>

                    <div class='popupfield seperated'>
                        <span>Target:</span>
                        <span>
                            <span>$
                                <input 
                                class='moneyInput' 
                                type='number'
                                placeholder={0}
                                ref={targetRef}/>
                            </span>
                        </span>
                    </div>
                    <div class='popupfield seperated'>
                        <span>Target Date <span style={'font-size: 0.9em'}>(optional)</span></span>
                        <span>
                            <input 
                                type="date"
                                ref={dateRef}
                                value={new Date().toISOString().split('T')[0]}
                                min={new Date().toISOString().split('T')[0]}
                                max={getDateFiveYearsFromNow()}
                            />
                        </span>
                    </div>
            
                    </div>
                    <Switch fallback={
                        <div class='popupfield spaced'>
                            <button onClick={() => cancel()}>Cancel</button>
                            <button onClick={submit}>{submitButtonString}</button>
                        </div>
                    }>  
                        <Match when={excessAmount() >= 0}>
                            <div class='popupfield message'>
                                <div>Lowering the target to this value means that you'll reached your goal.</div>
                                <Show when={excessAmount() > 0}>
                                    <div>
                                        There is <b>${excessAmount()}</b> of excess funds left over. 
                                        This money will be deposited back into your savings.
                                    </div>
                                </Show>
                            </div>
                            <div class='popupfield spaced'>
                                <button onClick={() => {
                                    targetRef.value = prevGoal().target
                                    setExcessAmount(-1)
                                    const inputSection = document.getElementById('Goal-popup-input-section')
                                    inputSection.classList.remove('no-pointer-events')
                                    }
                                }>Go back</button>
                                <button onClick={() => {
                                    const inputSection = document.getElementById('Goal-popup-input-section')
                                    inputSection.classList.remove('no-pointer-events')
                                    editGoalPart2();
                                }}>Confirm & Save</button>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </div>
        </div>
    );
}