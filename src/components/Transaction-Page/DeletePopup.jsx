import { createEffect } from "solid-js";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { useMoney } from '../../contexts/MoneyContext';

export default function MergePopup(props) {
    const { showPopup, setShowPopup } = useMainWrapperContext();
    const { moneyIn, moneyOut, setMoneyIn, setMoneyOut } = useMoney();

    let transactions, setTransactions, blurRef
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
        if (showPopup() === 'delete') {
            if (blurRef) blurRef.classList.add('blur');
        } 
    });

    const deleteTransactions = () => {
        const transactionList = document.getElementById('TransactionList-lower-wrapper')
        const checkboxes = transactionList.querySelectorAll('input[type="checkbox"]:checked');
        for (const checkbox of checkboxes) {
            transactions()[checkbox.getAttribute('index')].delete = true
        }
        setTransactions(prevTransactions => {
            const updatedTransactions = prevTransactions.filter(transaction => {
                return !transaction.delete;
            });
            return updatedTransactions;
        });
        setShowPopup('');
    };

    return (
        <Show when={showPopup() === 'delete'}>
            <div id='background-blur-grid' ref={blurRef}></div>
            <div id='background-grid'>
                <div></div>
                <div class="fullscreen-popup-wrapper">
                    <div class="fullscreen-popup">
                        <p>Are you sure you want to delete these transactions?</p>
                        <div class='transactionField amount'>
                            <button onClick={() => setShowPopup('')}>Cancel</button>
                            <button onClick={() => deleteTransactions()}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}