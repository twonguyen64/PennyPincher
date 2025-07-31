import { onMount } from "solid-js";
import { useMainWrapperContext } from "../contexts/MainWrapperContext"
import { useMoney } from "../contexts/MoneyContext";
import { GOALS_STORE } from "../utils/db";

export default function TransferMenu(props) {
    const { setShowPopup } = useMainWrapperContext();
    const { 
        allowance, changeAllowance, 
        savings, changeSavings,
        goals,
        editTransaction
    } = useMoney();

    const allowanceAccount = {
        name: 'Allowance',
        balance: allowance,
        set: changeAllowance
    }
    const savingsAccount = {
        name: 'Savings',
        balance: savings,
        set: changeSavings
    }
    
    const getCurrentGoal = () => {
        return goals().find(obj => obj.id === props.goalID);
    }
    const getCurrentGoalBalance = () => {
        return getCurrentGoal().balance
    }

    const createGoalObjectForTransfer = () => {
        return {
                name: getCurrentGoal().name,
                balance: getCurrentGoalBalance,
                set: function(amount) {
                    const goal = getCurrentGoal();
                    const updatedGoal = {
                        ...goal,
                        balance: goal.balance + amount
                    }
                    delete updatedGoal.set
                    editTransaction(updatedGoal, GOALS_STORE);
                }
            }
    }

    let account1 = null;
    let account2 = savingsAccount
    switch (props.account) {
        case 'Allowance':
            account1 = allowanceAccount;
            break;
        case 'Goal':
            account1 = savingsAccount
            account2 = createGoalObjectForTransfer();
    }


    let transferRef, arrowRef;
    const switchDirection = () => {
        arrowRef.classList.toggle('flip')
        const arrowWrapper = document.querySelector('.arrows-wrapper-positioner')
        if (arrowWrapper)
            arrowWrapper.classList.toggle('rotateArrowWrapper')
    }

    onMount(() => {
        const arrowWrapper = document.querySelector('.arrows-wrapper-positioner')
        if (!arrowWrapper) return
        if (arrowWrapper.classList.contains('rotateArrowWrapper')) {
            arrowRef.classList.toggle('flip')
        }
    })

    const submit = () => {
        const transferAmount = parseInt(transferRef.value)
        //Insures that a positive amount is transfered
        if (isNaN(transferAmount) || transferAmount <= 0) {
            alert(''); return
        }

        let startAccount = account1
        let endAccount = account2
        if (arrowRef.classList.contains('flip')) {
            startAccount = account2
            endAccount = account1
        }
        //Insures startAccount.balance will not be negative after transfer
        if (startAccount.balance() - transferAmount < 0) {
            alert('SDSDSAF'); return
        }
        startAccount.set(-1 * transferAmount)
        endAccount.set(transferAmount)
        transferRef.value = ''
    }
    return (
        <>  
            <div class="popup embedded">
                <div class="transfer-wrapper">
                    <div class="transfer-button" onClick={switchDirection}>
                        <span class="transfer-button-account">{account2.name}</span>
                        <span class="transfer-button-arrow" ref={arrowRef}>➜</span>
                        <span class="transfer-button-account">{account1.name}</span>
                    </div>
                    <div class="text-under-input-wrapper">
                        <div>
                            <span>$</span>
                            <input 
                                class="moneyInput"
                                type="number"
                                placeholder={0}
                                ref={transferRef}
                            />
                        </div>
                        <div class="text-under-input">Transfer amount</div>
                    </div>
                </div>
                <div class="popupfield spaced">
                    <button onClick={() => setShowPopup('')}>Cancel</button>
                    <button onClick={submit}>Done</button>
                </div>
            </div>
        </>
    )
}