import editImg from '../../assets/edit.png';
import closeImg from '../../assets/close-button.png';
import { Switch, Match, For, createEffect, onCleanup  } from 'solid-js';

import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

import Transaction from './Transaction';
import MergePopup from './MergePopup';
import DeletePopup from './DeletePopup'
import EditPopup from './EditPopup';
import AccountMenuType from '../AccountMenuType';

export default function TransactionList(props) {
    const { moneyIn, moneyOut, } = useMoney();

    const { editMode, setEditMode, showPopup, setShowPopup, checkboxCount, setCheckboxCount } = useMainWrapperContext();
    let transactions;
    let listRef;
    switch (props.type) {
        case 'income':
            transactions = moneyIn
            break;
        case 'expense':
            transactions = moneyOut
            break;
    }

    createEffect(() => {
        const checkTransactionsToTrigger = transactions().length;
        if (listRef) {
            listRef.scrollTop = listRef.scrollHeight - listRef.clientHeight
        }
    });

    const countCheckboxes = (event) => {
        if (event.target.type === 'checkbox') {
            const checkedBoxes = listRef.querySelectorAll('input[type="checkbox"]:checked');
            let count = checkedBoxes.length || 0;
            setCheckboxCount(count);
        }
    };

    createEffect(() => {
        if (editMode() && listRef) 
            listRef.addEventListener('click', countCheckboxes);
        onCleanup(() => {
            if (listRef) {
                listRef.removeEventListener('click', countCheckboxes);
                if (!editMode()) setCheckboxCount(0);
            }
        });
    });

    return (
        <div id="TransactionList">
            <Show when={showPopup() === 'merge'}>
                <MergePopup type={props.type}/>
            </Show>
            <Show when={showPopup() === 'delete'}>
                <DeletePopup type={props.type}/>
            </Show>
             <Show when={showPopup() === 'edit'}>
                <EditPopup type={props.type}/>
            </Show>
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
                    <Show when={checkboxCount() === 1}>
                        <div onClick={() => setShowPopup('edit')} style={'width: 8rem'}>Edit transaction</div>
                    </Show>
                    <Show when={checkboxCount() > 1}>
                        <div onClick={() => setShowPopup('merge')} style={'width: 8rem'}>Merge transactions</div>
                    </Show>
                     <Show when={checkboxCount() > 0}>
                        <div onClick={() => setShowPopup('delete')}>Delete selected</div>
                    </Show>
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