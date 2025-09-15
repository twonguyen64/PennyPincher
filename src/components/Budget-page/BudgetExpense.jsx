import { createMemo } from "solid-js"

import EditModeCheckbox from '../Transaction-Page/Checkbox';

export default function BudgetExpense(props) {
    const { expense, payFreqValue } = props
    const amount = createMemo(() => {
        return parseInt((expense.cost / expense.freq) * payFreqValue);
    });

    return (
        <div class='BudgetExpense BudgetList-grid ObjectContainer' objectID={expense.id}>
            <span class='BudgetExpense-name-wrapper'>
                <EditModeCheckbox/>
                <span>{expense.name}</span>
            </span>
            <span class="BudgetExpense-rate">
                <span class='BudgetExpense-rate-cost'>${expense.cost}</span>
                <span class='BudgetExpense-rate-freq'>{expense.freqStr}</span>
                <span style={'text-align: right;'}>➜&nbsp;</span>
            </span> 
            <span>${amount()}</span>
        </div>
    )
}