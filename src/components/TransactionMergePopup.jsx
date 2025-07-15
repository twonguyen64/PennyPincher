import { createEffect } from "solid-js";
import { useMainWrapperContext } from "../contexts/MainWrapperContext";
import { useMoney } from '../contexts/MoneyContext';

export default function MergePopup(props) {
    const { showMergePopup, setShowMergePopup } = useMainWrapperContext();
    const { moneyIn, moneyOut, setMoneyIn, setMoneyOut, addMoneyIn, takeMoneyOut } = useMoney();

    let transactions, setTransactions, mergeEntry, blurRef
    switch (props.type) {
        case 'income':
            transactions = moneyIn
            setTransactions = setMoneyIn
            mergeEntry = addMoneyIn
            break;
        default:
            transactions = moneyOut
            setTransactions = setMoneyOut
            mergeEntry = takeMoneyOut
    }

     createEffect(() => {
        if (showMergePopup()) {
            if (blurRef) blurRef.classList.add('blur');
        } 
    });

    const mergeTransactions = () => {
        let sumAmount = 0
        let sumSavings = 0
        for (const transaction of transactions()) {
            console.log(transaction)
            sumAmount += (transaction.amount || 0)
            sumSavings += (transaction.savings || 0)
        }
        setTransactions([])
        const newTransaction = {
            type: props.type,
            name: 'MERGED',
            amount: sumAmount,
            savings: sumSavings,
        };
        mergeEntry(newTransaction);
        setShowMergePopup(false);
    };

    return (
        <Show when={showMergePopup()}>
            <div id='background-blur-grid' ref={blurRef}></div>
            <div id='background-grid'>
                <div></div>
                <div class="fullscreen-popup-wrapper">
                    <div class="fullscreen-popup">
                        <p>You can merge together all transactions up until now to save space. This action is not reversible. Would you like to continue?</p>
                        <div class='transactionField amount'>
                            <button onClick={() => setShowMergePopup(false)}>Cancel</button>
                            <button onClick={() => mergeTransactions()}>Merge</button>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}