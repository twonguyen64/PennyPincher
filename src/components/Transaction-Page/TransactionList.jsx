import addImg from '../../assets/add.png'
import editImg from '../../assets/edit.png';
import closeImg from '../../assets/close-button.png';
import { Switch, Match, For, createEffect } from 'solid-js';

import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

import Transaction from './Transaction';
import MergePopup from './MergePopup';
import DeletePopup from './DeletePopup'
import AccountMenuType from '../AccountMenuType';

export default function TransactionList(props) {
    const { moneyIn, moneyOut, setMoneyIn, setMoneyOut } = useMoney();

    const { editMode, setEditMode, setShowPopup } = useMainWrapperContext();
    let transactions, setTransactions, popupType, popupTypeSavings;
    let listRef;
    switch (props.type) {
        case 'income':
            transactions = moneyIn
            setTransactions = setMoneyIn
            popupType = 'depositIncome'
            popupTypeSavings = 'depositSavings'
            break;
        case 'expense':
            transactions = moneyOut
            setTransactions = setMoneyOut
            popupType = 'withdrawExpense'
            popupTypeSavings = 'withdrawSavings'
            break;
    }

    createEffect(() => {
        const checkTransactionsToTrigger = transactions().length;
        if (listRef) {
            listRef.scrollTop = listRef.scrollHeight - listRef.clientHeight
        }
    });

    return (
        <div id="TransactionList">
            <MergePopup type={props.type}/>
            <DeletePopup type={props.type}/>
            <Switch fallback={
                <div id="TransactionList-upper-wrapper">
                    <span style={'font-weight: bold;'}>Transaction History</span>
                    <div class='edit-button' onClick={() => setEditMode(true)}>
                        <img src={editImg} alt=""/>
                        Edit
                    </div>
                </div>
                }>
            <Match when={editMode()}>
                <div id="TransactionList-upper-wrapper" class="edit">
                    <div onClick={() => setShowPopup('merge')}>Merge transactions</div>
                    <div onClick={() => setShowPopup('delete')}>Delete selected</div>
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
                            index={index()}
                        />
                    )}
                </For>
                )}

                <AccountMenuType type={props.type}/>
            </div>
        </div>
    ); 
}