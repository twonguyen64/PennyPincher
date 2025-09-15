import { Show, For,  createMemo, createSignal, createEffect} from 'solid-js'
import { useMainWrapperContext } from '../contexts/MainWrapperContext';
import { useMoney } from '../contexts/MoneyContext';
import { BUDGET_STORE } from '../utils/db';

import addIcon from '../assets/add.svg'
import editImg from '../assets/edit.svg'
import PopupBudget from '../components/Budget-page/PopupBudget';
import PopupDelete from '../components/Transaction-Page/PopupDelete';
import BudgetExpense from '../components/Budget-page/BudgetExpense'
import EditModeMenu from '../components/EditModeMenu';
import AddButton from '../components/AddButton';

export default function Budget() {
    const { 
        editMode, setEditMode,
        showPopup, setShowPopup, 
    } = useMainWrapperContext();
    
    const { budgetExpenses, payFreq, setPayFreq, totalBudgetCost, setTotalBudgetCost } = useMoney();

    let weekly, biweekly, monthly
    createEffect(() => {
        if (payFreq) {
            switch(payFreq().value) {
                case 7:
                    weekly.classList.add('selected')
                    biweekly.classList.remove('selected')
                    monthly.classList.remove('selected')
                    break;
                case 14:
                    weekly.classList.remove('selected')
                    biweekly.classList.add('selected')
                    monthly.classList.remove('selected')
                    break;
                case 30:
                    weekly.classList.remove('selected')
                    biweekly.classList.remove('selected')
                    monthly.classList.add('selected')
                    break;
            }
        }
    })

    /**
     * @param {Array} expensesArray Array of budget expenses
     * @param {Accessor<Number>} payFreq Number of days (weekly, bi-weekly, monthly). Must call as accessor to provoke reactivity.
     */
    const calculateAmountPerPeriod = (expensesArray, payFreq) => {
        return expensesArray.reduce((sum, expense) => {
            const cost = parseInt((expense.cost / expense.freq) * payFreq);
            return sum + (isNaN(cost) ? 0 : cost);
        }, 0);
    }
    
    //Payment Frequency
    let budgetHeaderOptions;
    const setPaymentFrequency = (e) => {
        if (e.target.tagName != 'SPAN') return
        //Avoid redundant update
        if (payFreq().value === parseInt(e.target.getAttribute('days'))) return
        const payFreqValue = parseInt(e.target.getAttribute('days'))
        
        const payFreqStrings = {
            7: 'Weekly',
            14: 'Bi-weekly',
            30: 'Monthly'
        }
        const newPayFreq =  {
            value: payFreqValue,
            string: payFreqStrings[payFreqValue]
        }
        
        setPayFreq(newPayFreq)
    }

    //Memos:
    const totalCostPerPeriod = createMemo(() => {
        if (!totalBudgetCost()) return 0
        
        const totalCost = calculateAmountPerPeriod(budgetExpenses(), payFreq())
        setTotalBudgetCost(totalCost)
        return totalCost
    });

    const budgetExpensesByTag = createMemo(() => {
        const groups = {};
        budgetExpenses().forEach(item => {
            if (!groups[item.tag]) groups[item.tag] = [];
            groups[item.tag].push(item);
        });
        const sortedTags = Object.keys(groups).sort();
        return sortedTags.map(tag => [tag, groups[tag]]);
    });

    return (
        <>
        <Show when={showPopup() === 'budget'}>
            <PopupBudget/>
        </Show>
        <Show when={showPopup() === 'delete'}>
            <PopupDelete store={BUDGET_STORE}/>
        </Show>
        <div class='page-single' ontouchstart="">
            <div id='budgetpage-scroller'>
                <div class='page-header-empty'></div>

                <Switch fallback={
                    <div id="TransactionList-upper-wrapper">
                        <span style={'font-weight: bold;'}>Budget Sheet</span>
                        <Show when={budgetExpenses().length > 0}>
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


                <div id="budgetHeader">
                    <span>How often do you get paid?</span>
                    <span id="BudgetHeader-options-wrapper" ref={budgetHeaderOptions} onTouchEnd={setPaymentFrequency}>
                        <span class='BudgetHeader-options' days={7} ref={weekly}>Weekly</span>
                        <span class='BudgetHeader-options' days={14} ref={biweekly}>Bi-weekly</span>
                        <span class='BudgetHeader-options' days={30} ref={monthly}>Monthly</span>
                    </span>
                </div>
                <div id='BudgetList'>
                <For each={budgetExpensesByTag()}>
                    {([tag, expenses]) => {
                        const totalCostForTag = createMemo(() => {
                            return calculateAmountPerPeriod(expenses, payFreq().value)
                        });

                        return (
                            <div class='BudgetList-TagGroup'>
                                <div class='BudgetList-TagGroup-summary BudgetList-grid'>
                                    <span class='BudgetList-TagGroup-tag'>{tag}</span>
                                    <span class='BudgetList-TagGroup-cost-str'>{payFreq().string} cost:</span>
                                    <span class='BudgetList-TagGroup-cost-total'>${totalCostForTag}</span>

                                </div>
                                <For each={expenses}>
                                    {(expense) => (
                                        <BudgetExpense
                                        expense={expense}
                                        payFreqValue={payFreq().value}
                                        />
                                    )}
                                </For>
                            </div>
                        );
                    }}
                </For>
                </div>
                <AddButton
                    icon={addIcon} text={'Add a budget item'} 
                    onClick={() => setShowPopup('budget')}
                />
            </div>
            
            <div class='Total-footer'>
                <span class='Total-footer-value-wrapper'>
                    <div>Total {payFreq().string.toLowerCase()} expenses: </div>
                    <div class='Total-footer-value'>${totalCostPerPeriod()}</div>
                </span>
            </div>
        </div>
        </>
    )
}