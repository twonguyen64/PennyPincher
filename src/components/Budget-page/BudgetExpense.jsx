import { createMemo } from "solid-js"
import { useMainWrapperContext } from "../../contexts/MainWrapperContext"

import EditModeCheckbox from '../Transaction-Page/Checkbox';

export default function BudgetExpense(props) {
    const { payFreq } = useMainWrapperContext()

    const amount = createMemo(() => {
        return parseInt((props.cost / props.freq) * payFreq());
    });

    return (
        <div class='BudgetExpense BudgetList-grid ObjectContainer' objectID={props.objectID}>
            <span class='BudgetExpense-name-wrapper'>
                <EditModeCheckbox/>
                <span>{props.name}</span>
            </span>
            <span class="BudgetExpense-rate">
                <span class='BudgetExpense-rate-cost'>${props.cost}</span>
                <span class='BudgetExpense-rate-freq'>{props.freqStr}</span>
                <span style={'text-align: right;'}>➜&nbsp;</span>
            </span> 
            <span>${amount()}</span>
        </div>
    )
}