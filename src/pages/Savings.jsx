import { Show, createSignal, createEffect } from 'solid-js'
import { useMoney } from "../contexts/MoneyContext";
import { useMainWrapperContext } from '../contexts/MainWrapperContext'
import { getObjectFromScroller } from '../utils/util-functions'

import PopupSavings from '../components/Savings-page/PopupSavings';
import PopupLink from '../components/Savings-page/PopupLink';

import GoalScroller from '../components/Savings-page/GoalScroller';
import GoalInfo from '../components/Savings-page/GoalInfo';

import PaymentPlanTimeline from '../components/Savings-page/PaymentPlanTimeline';

export default function Savings() {
    const { showPopup } = useMainWrapperContext();
    const { goals } = useMoney();
    const [currentGoal, setCurrentGoal] = createSignal(null);
    const [isGoalVisible, setIsGoalVisible] = createSignal(false)

    createEffect(() => {
        const scrollerRef = document.getElementById("Goal-scroller")
        if (goals() && scrollerRef) {
            const goal = getObjectFromScroller(scrollerRef, goals())
            if (goal) {
                setCurrentGoal(goal)
                setIsGoalVisible(true)
            }
        }
    });

    return (
        <>
        <Show when={showPopup() === 'goal'}>
            <PopupSavings/>
        </Show>
        <Show when={showPopup() === 'link'}>
            <PopupLink/>
        </Show>
        <div class='page-multi' id='Savingspage'>
            <div class='page-single' id='Savingspage-main' ontouchstart="">
                <div class='page-header'>Your savings goals</div>
                
                <GoalScroller 
                    currentGoal={currentGoal}
                    setCurrentGoal={setCurrentGoal}
                    isGoalVisible={isGoalVisible}
                    setIsGoalVisible={setIsGoalVisible}
                />
                
                <div id='Goals-account-wrapper'>
                    <GoalInfo 
                    currentGoal={currentGoal}
                    isGoalVisible={isGoalVisible}
                    />
                </div>
            </div>
            
            <div class='page-single' id='Savingspage-timeline'>
                <PaymentPlanTimeline/>
            </div>
        </div>
        </>
    );
}