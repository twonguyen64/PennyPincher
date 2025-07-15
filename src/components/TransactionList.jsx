import addImg from '../assets/add.png'
import editImg from '../assets/edit.png';
import closeImg from '../assets/close-button.png';
import { createSignal, Switch, Match, For, createEffect } from 'solid-js';

import { useMoney } from '../contexts/MoneyContext';
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

import Transaction from './Transaction';
import MergePopup from './TransactionMergePopup'

export default function TransactionList(props) {
    const { moneyIn, moneyOut, setMoneyIn, setMoneyOut } = useMoney();
    const [editMode, setEditMode] = createSignal(false);

    const { setShowPopup, setShowMergePopup, setShowSelectMultiple, showSelectMultiple } = useMainWrapperContext();
    let transactions, setTransactions, listRef;
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
        const checkTransactionsToTrigger = transactions().length;
        if (listRef) {
            listRef.scrollTop = listRef.scrollHeight - listRef.clientHeight
        }
    });

    const deleteTransactions = () => {
        const checkboxes = document.getElementById('TransactionList-lower-wrapper').querySelectorAll('input[type=checkbox]');
        for (const checkbox of checkboxes) {
            if (checkbox.checked)
                transactions()[checkbox.getAttribute('data-key')].delete = true
        }
        setTransactions(prevTransactions => {
            const updatedTransactions = prevTransactions.filter(transaction => {
                return !transaction.delete;
            });
            return updatedTransactions; // <-- Missing return statement
        });
    };

    return (
        <div id="TransactionList">
            <MergePopup type={props.type}/>
            <Switch fallback={
                <div id="TransactionList-upper-wrapper">
                    <span style={'font-weight: bold; font-size: 1.2em'}>Transaction History</span>
                    <div class='edit-button' onClick={() => setEditMode(true)}>
                        <img src={editImg} alt=""/>
                        Edit Transactions
                    </div>
                </div>
                }>
            <Match when={showSelectMultiple()}>
                <div id="TransactionList-upper-wrapper" class="edit">
                    <div onClick={() =>  deleteTransactions()}>Deleted selected transactions</div>
                    <img src={closeImg} alt="X" onClick={() => {
                        setShowSelectMultiple(false); setEditMode(false)}
                    }/>
                </div>
            </Match>
            <Match when={editMode()}>
                <div id="TransactionList-upper-wrapper" class="edit">
                    <div onClick={() => setShowMergePopup(true)}>Merge transactions</div>
                    <div onClick={() => setShowSelectMultiple(true)}>Choose transactions to delete</div>
                    <img src={closeImg} alt="X" onClick={() => setEditMode(false)}/>
                </div>
            </Match>
            </Switch>
            <div id="TransactionList-lower-wrapper" ref={listRef} class='hidden-scrollbar'>
                {transactions().length === 0 ? 
                (<p>No transactions yet.</p>) : 
                (<For each={transactions()}>
                    {(transaction, index) => (
                        <Transaction
                            type={props.type}
                            name={transaction.name}
                            amount={transaction.amount} 
                            savings={transaction.savings}
                            date={transaction.date}
                            key={index()}
                        />
                    )}
                </For>
                )}

                <div class="account-menu-add-button" onClick={() => setShowPopup(true)}>
                    <img src={addImg} alt="+"/>
                    <span>Add {props.type}</span>
                </div>
            </div>
        </div>
    ); 
}