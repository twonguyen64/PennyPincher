import { Show, For,  createMemo, onMount} from 'solid-js'
import { useMainWrapperContext } from '../contexts/MainWrapperContext';
import { useMoney } from '../contexts/MoneyContext';
import { BUDGET_STORE } from '../utils/db';

import addIcon from '../assets/add.svg'
import editImg from '../assets/edit.svg'
import PopupBudget from '../components/Budget-page/PopupBudget';
import PopupDelete from '../components/Transaction-Page/PopupDelete';
import BudgetExpense from '../components/Budget-page/BudgetExpense'
import EditModeMenu from '../components/EditModeMenu';
import BackgroundBlur from '../components/BackgroundBlur';
import AddButton from '../components/AddButton';

export default function Budget() {
    const { 
        editMode, setEditMode,
        showPopup, setShowPopup, 
        payFreq, setPayFreq 
    } = useMainWrapperContext();
    
    const { budgetExpenses, setTotalBudgetCost } = useMoney();

    let biweekly
    onMount(() => {
        biweekly.classList.add('selected')
    })

    let listRef;

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
        if (payFreq() === parseInt(e.target.getAttribute('days'))) return
        const payFrequencyInDays = parseInt(e.target.getAttribute('days'))
        setPayFreq(payFrequencyInDays)

        const prevSelected = budgetHeaderOptions.querySelector('.selected')
        if (prevSelected) prevSelected.classList.remove('selected')
        e.target.classList.add('selected')
    }
    const payFrequencyStr = createMemo(() => {
        const payFrequencyStrings = {
            7: 'Weekly',
            14: 'Bi-weekly',
            30: 'Monthly'
        }
        return payFrequencyStrings[payFreq()]
    });

    //Memos:
    const totalCostPerPeriod = createMemo(() => {
        const totalCost = calculateAmountPerPeriod(budgetExpenses(), payFreq())
        const payFrequencyStrings = {
            'Weekly': 7,
            'Bi-weekly': 14,
            'Monthly': 30
        }
        setTimeout(() => { //Defer storing to DB right away
            setTotalBudgetCost({
                freqInDays: payFrequencyStrings[payFrequencyStr()],
                freqStr: payFrequencyStr(),
                amount: totalCost
            });
        }, 200)
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
        <div class='page-single' ontouchstart="">
            <BackgroundBlur/>
            <div id='budgetpage-scroller'>
            <Show when={showPopup() === 'budget'}>
                <PopupBudget/>
            </Show>
            <Show when={showPopup() === 'delete'}>
                <PopupDelete store={BUDGET_STORE}/>
            </Show>
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
                <span id="BudgetHeader-options-wrapper" ref={budgetHeaderOptions} onClick={setPaymentFrequency}>
                    <span class='BudgetHeader-options' days={7}>Weekly</span>
                    <span class='BudgetHeader-options' days={14} ref={biweekly}>Bi-weekly</span>
                    <span class='BudgetHeader-options' days={30}>Monthly</span>
                </span>
            </div>
            <div id='BudgetList' ref={listRef}>
            <For each={budgetExpensesByTag()}>
                {([tag, expenses]) => {
                    const totalCostForTag = createMemo(() => {
                        return calculateAmountPerPeriod(expenses, payFreq())
                    });

                    return (
                        <div class='BudgetList-TagGroup'>
                            <div class='BudgetList-TagGroup-summary BudgetList-grid'>
                                <span class='BudgetList-TagGroup-tag'>{tag}</span>
                                <span class='BudgetList-TagGroup-cost-str'>{payFrequencyStr()} cost:</span>
                                <span class='BudgetList-TagGroup-cost-total'>${totalCostForTag}</span>

                            </div>
                            <For each={expenses}>
                                {(expense) => (
                                    <BudgetExpense
                                    objectID={expense.id}
                                    name={expense.name}
                                    cost={expense.cost}
                                    freq={expense.freq}
                                    freqStr={expense.freqStr}
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
            
            <div id='budgetpage-footer'>
                
                <span id='budgetpage-totalexpenses-wrapper'>
                    <div>Total {payFrequencyStr().toLowerCase()} expenses: </div>
                    <div id='budgetpage-totalexpenses'>${totalCostPerPeriod()}</div>
                </span>
            </div>
        </div>
    )
}