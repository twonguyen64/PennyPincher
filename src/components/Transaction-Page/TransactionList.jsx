import { Switch, Match, For, createEffect, createMemo  } from 'solid-js';
import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext';
import { dateToStr } from '../../utils/util-functions'

import Transaction from './Transaction';
import TagChooser from '../TagChooser';
import EditModeMenu from '../EditModeMenu';
import AddButton from '../AddButton';

import editImg from '../../assets/edit.svg';
import searchImg from '../../assets/search.svg'
import addIcon from '../../assets/add.svg'

export default function TransactionList() {
    const { editMode, setEditMode, setShowPopup, selectedTag } = useMainWrapperContext();
    const { transactions } = useMoney();
    
    let listRef, searchbar, searchTrigger, searchWrapper;


    createEffect(() => {
        const checkTransactionsToTrigger = transactions().length;
        if (listRef) {
            listRef.scrollTop = listRef.scrollHeight - listRef.clientHeight
        }
    });
    const openSearchOptions = () => {
        if (searchTrigger.textContent.includes('▼')) {
            searchWrapper.classList.add('active')
            searchTrigger.textContent = 'Sort options ▲'
        }
        else {
            searchWrapper.classList.remove('active')
            searchTrigger.textContent = 'Sort options ▼'
        }
            
    }

    const filteredTransactions = createMemo(() => {
        const currentTag = selectedTag();
        if (currentTag === '')
            return transactions();
        return transactions().filter(transaction => transaction.tag === currentTag)
    });

    
    return (
        <div id="TransactionList">
            <Switch fallback={
                <div id="TransactionList-upper-wrapper">
                    <span style={'font-weight: bold;'}>Transaction History</span>
                    <Show when={transactions().length > 0}>
                        <div class='borderless-button' onClick={() => setEditMode(true)}>
                            <img src={editImg} alt=""/>
                            Edit
                        </div>
                    </Show>
                </div>
                }>
            <Match when={editMode()}>
                <EditModeMenu/>
            </Match>
            </Switch>
            <Show when={transactions().length > 0}>
                <div id='TransactionList-search-wrapper' ref={searchWrapper}>
                    <div id='TransactionList-searchbar'>
                        <img src={searchImg}/>
                        <input ref={searchbar} type='text' placeholder='Search'/>
                    </div>
                    <TagChooser/>
                </div>
                <div id='TransactionList-search-dropdown-button'>
                    <span ref={searchTrigger} onClick={openSearchOptions}
                    style={'cursor: pointer'}>Sort options ▼</span>
                </div>
            </Show>
            <div id="TransactionList-lower-wrapper" ref={listRef} class='hidden-scrollbar'>
                {transactions().length === 0 ? 
                (<p>No transactions yet.</p>) : 
                (<For each={filteredTransactions()}>
                    {(transaction, index) => {
                        const prev = index() > 0 ? filteredTransactions()[index() - 1] : false;
                        const shouldShowDate = prev ? prev.date !== transaction.date : true

                        return (
                            <>
                                {(shouldShowDate || index() === 0) && <div class='TransactionList-date'>{dateToStr(transaction.date)}</div>}
                                <Transaction
                                objectID={transaction.id}
                                type={transaction.type}
                                tag={transaction.tag}
                                name={transaction.name}
                                income={transaction.income} 
                                expense={transaction.expense}
                                />
                            </>
                        );
                    }}
                </For>
                )}

                <div class="AddButton-wrapper">
                    <AddButton 
                        icon={addIcon} text={'Add paycheque'} 
                        onClick={() => {setEditMode(false); setShowPopup('paycheque')}}
                    />
                    <AddButton 
                        icon={addIcon} text={'Add expense'} 
                        onClick={() => {setEditMode(false); setShowPopup('expense')}}
                    /> 
                </div>
            </div>
        </div>
    ); 
}