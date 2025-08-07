



import { useMoney } from '../../contexts/MoneyContext';
import { generatePaymentPlan } from '../../utils/util-functions';
import { onMount, onCleanup, createMemo, For } from 'solid-js';

import PlanTimelineRow from './PlanTimelineRow';
import TimelineDateOverlay from './TimelineDateOverlay';
import TimelineGridOverlay from './TimelineGridOverlay';

export default function PaymentPlanSummary() {
    const { goals, totalBudgetCost } = useMoney();

    const goalsWithPaymentPlan = createMemo(() => {
        return goals()
        .filter(goal => goal.hasPaymentPlan)
        .map(goal => ({
            goal: goal,
            plan: generatePaymentPlan(goal, totalBudgetCost())
        }));
    });

    //For initialization
    const timeline = createMemo(() => {
        const payments = goalsWithPaymentPlan()
            .map(goal => goal.plan.numberOfPayments);

        const totalInstallmentValue = payments
            .reduce((sum, amount) => {
                return sum + (isNaN(amount) ? 0 : amount)
            }, 0);

        const maxNumberOfPayments = payments.length > 0 ? Math.max(...payments) : 0;
        document.documentElement.style.setProperty(
            '--timeline-columns', maxNumberOfPayments
            //2 extra columns + goal at the end
        );
        return {
            totalInstallmentValue: totalInstallmentValue,
            maxNumberOfPayments: maxNumberOfPayments,
        }
    });

    //Sync scrolling
    let goalsWrapperRef, calendarRef, overlayRef;
    const scrollSync = () => {
        goalsWrapperRef.scrollTop = calendarRef.scrollTop
        overlayRef.scrollLeft = calendarRef.scrollLeft
    };
    onMount(() => calendarRef.addEventListener("scroll", scrollSync));
    onCleanup(() => calendarRef.removeEventListener("scroll", scrollSync));

    return (
        <>
        <div id='Timeline-calendar-wrapper'>
            <TimelineDateOverlay
            maxColumns={timeline().maxNumberOfPayments}
            freq={totalBudgetCost().freqInDays}
            ref={overlayRef}
            />
            <div id='Timeline-calendar'>
                <div 
                id="Timeline-goals-wrapper" 
                class='Timeline-calendar-container hidden-scrollbar no-touch-events'
                ref={goalsWrapperRef} 
                >   
                    <For each={goalsWithPaymentPlan()}>
                        {(goal) => {
                            return (
                                <div class='Timeline-rows-item goal'>
                                    <div class='Timeline-rows-item goal-name'>
                                        {goal.goal.name}
                                    </div>
                                    <div class='Timeline-rows-item goal-amount'>
                                        ${goal.plan.paymentAmount}
                                    </div>
                                    <div class='Timeline-rows-item goal-payments'>
                                        <b>{goal.plan.numberOfPayments}</b>s left
                                    </div>
                                </div>
                            );  
                        }}
                    </For>
                </div>

                <div 
                id="Timeline-rows-wrapper" 
                class='Timeline-calendar-container' 
                ref={calendarRef}
                >
                    <div id='Timeline-calendar-container-inner'>
                    <TimelineGridOverlay
                    maxColumns={timeline().maxNumberOfPayments}
                    freq={totalBudgetCost().freqInDays}
                    />
                    <For each={goalsWithPaymentPlan()}>
                        {(goal) => {
                            return (
                                <PlanTimelineRow 
                                    plan={goal.plan} 
                                    maxColumns={timeline().maxNumberOfPayments}
                                />
                            );  
                        }}
                    </For>
                    </div>
                </div>
            </div>
        </div>
        <div class='Total-footer'>
            <span class='Total-footer-value-wrapper'>
                <div>Total {totalBudgetCost().freqStr.toLowerCase()} contribution: </div>
                <div class='Total-footer-value'>$0</div>
            </span>
        </div>
        </>
    )
}