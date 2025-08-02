import { createEffect, createMemo, createSignal, untrack } from 'solid-js';

import PaymentPlan from './PaymentPlan';
import ToggleSwitch from '../ToggleSwitch';
import { useMoney } from '../../contexts/MoneyContext';
import { GOALS_STORE } from '../../utils/db';

export default function PaymentPlanWrapper(props) {
    const { currentGoal } = props
    const { editTransaction } = useMoney();

    let planOuterWrapperRef, planInnerWrapperRef, toggleRef;
    
    const [prevGoal, setPrevGoal ] = createSignal(null)
    setPrevGoal(currentGoal())

    /**Conditional that helps hide the closing animation and optimize calculations */
    const hide = createMemo(() => {
        //Returns false in two cases:
        // 1) When you scroll from a goal that has a plan to a goal that doesn't have one.
        // 2) When you scroll from a goal that has no plan to another that has none either.
        //(A and !B) OR (!A && !B) where A and B are currGoal, prevGoal that hasPaymentPlan
        //Simplifies to !B
        const currGoal = currentGoal()
        const previousGoal = untrack(prevGoal)
        const triggerClosingAnimation = (!currGoal.hasPaymentPlan)

        //True also occurs when you open and close the plan on the same goal.
        //So that scenario is omitted too:
        const isDifferentGoal = (previousGoal.id !== currGoal.id)
        setPrevGoal(currGoal)
        
        const result = !(triggerClosingAnimation && isDifferentGoal)
        return result
    })

    createEffect(() => {
        const hasPaymentPlan = currentGoal().hasPaymentPlan
        if (hasPaymentPlan) {
            planOuterWrapperRef.classList.add('active')
            planInnerWrapperRef.classList.add('active')
        }
        else {
            planOuterWrapperRef.classList.remove('active')
            planInnerWrapperRef.classList.remove('active')
        }
    })
    const toggle = () => {
        const isChecked = toggleRef.checked
        const editedGoal = {
            ...currentGoal(),
            hasPaymentPlan: isChecked
        }
        editTransaction(editedGoal, GOALS_STORE)
    }
    
    return (
        <div id='PaymentPlan-outer-wrapper' ref={planOuterWrapperRef}>
            <div id='PaymentPlan-toggle-wrapper'>
                <ToggleSwitch 
                    color={'var(--savings-color-mid)'} 
                    height={'1.4rem'}
                    checked={currentGoal().hasPaymentPlan}
                    onClick={toggle}
                    ref={toggleRef}
                />
                <span>Turn on payment plan</span>
            </div>
            <div id='PaymentPlan-inner-wrapper' ref={planInnerWrapperRef}>
                <Show when={currentGoal() && hide()} keyed>
                    <PaymentPlan goal={currentGoal()}/>
                </Show>
            </div>
        </div>
    )
}