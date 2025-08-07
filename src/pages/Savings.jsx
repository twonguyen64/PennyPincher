import { For, Show, createSignal, createEffect } from 'solid-js'
import { useMoney } from "../contexts/MoneyContext";
import { useMainWrapperContext } from '../contexts/MainWrapperContext'
import { getCenterElementOfScroller, getObjectFromElement, getObjectFromScroller } from '../utils/util-functions'

import SavingsGoal from "../components/Savings-page/SavingsGoal";
import PopupSavings from '../components/Savings-page/PopupSavings';
import BackgroundBlur from '../components/BackgroundBlur';
import AddButton from '../components/AddButton';
import addIcon from '../assets/add.svg'
import swapIcon from '../assets/swap.svg'

import AccountDisplay from '../components/AccountDisplay';
import AnimatedArrows from '../components/AnimatedArrows';

import GoalInfo from '../components/Savings-page/GoalInfo';
import PaymentPlanTimeline from '../components/Savings-page/PaymentPlanTimeline';
import GoalScrollerColumn from '../components/Savings-page/GoalScrollerColumn';

export default function Savings() {
    const { showPopup, setShowPopup } = useMainWrapperContext();

    const { goals, savings } = useMoney();
    const [currentGoal, setCurrentGoal] = createSignal(null);
    const [isGoalVisible, setIsGoalVisible] = createSignal(false)
    const [scrollerState, setScrollerState] = createSignal('row')
    let scrollerRef, addGoalRef;

    createEffect(() => {
        if (goals()) {
            const goal = getObjectFromScroller(scrollerRef, goals())
            if (goal) updateCurrentGoal(goal)
        }
    });
    const updateCurrentGoal = (goal) => {
        setCurrentGoal(goal)
        setIsGoalVisible(true)
    }

    /**
     * Sets the current goal when scrolling to a new goal.
     * Also prevents scrolling if the user scrolls to the 'Add goal button' in transfer mode
     */
    const scrollEnd = () => {
        if (goals().length < 1) return
        else if (scrollerState() !== 'row') return

        let middleElement = getCenterElementOfScroller(scrollerRef)
        //Case: middle element is the "Add goal" button
        if (middleElement === addGoalRef) {
            if (showPopup() === 'transfer') {
                //Prevent scrolling
                middleElement = addGoalRef.previousElementSibling
                middleElement.scrollIntoView({behavior: 'smooth',inline: 'center'});
            } 
            else {
                setIsGoalVisible(false)
            }
        }
        //Otherwise, middle element is a goal.
        else {
            const objectID = parseInt(middleElement.getAttribute('objectid'))
            if (objectID == currentGoal().id && isGoalVisible()) return
            //Save current goal object to signal if scrolled to a new goal
            const goal = getObjectFromElement(middleElement, goals())
            updateCurrentGoal(goal)
        }
    };

    const toggleScrollerState = () => {
        switch (scrollerState()) {
            case 'row':
                setScrollerState('to-column');
                break;
            case 'column':
                setScrollerState('to-row');
                break;
        }
    }
    function handleTransitionEnd(event) {
        if (event.propertyName !== 'max-height') return;
        switch (scrollerState()) {
            case 'to-column':
                setScrollerState('column');
                break;
            case 'to-row':
                setScrollerState('row');
                break;
        }
    }

    return (
        <div class='page-multi' id='Savingspage'>
        <div class='page-single' id='Savingspage-main' ontouchstart="">
            <BackgroundBlur/>
            <Show when={showPopup() === 'goal'}>
                <PopupSavings/>
            </Show>
            <div class='page-header'>Your savings goals</div>
            
            <div 
            id='Goals-scroller-wrapper'
            class={`hidden-scrollbar ${scrollerState()}`} 
            on:transitionend={handleTransitionEnd}
            >
                <Show when={goals().length > 1}>
                    <span id='Goals-rearrange-button' onTouchEnd={toggleScrollerState}>
                        <img src={swapIcon}/>
                        Reorder goals
                    </span>
                </Show>
                
                <Show when={
                    scrollerState() === 'column' || 
                    scrollerState() === 'to-row'
                }>
                <GoalScrollerColumn goals={goals()}/>
                </Show>

                <Show when={
                    scrollerState() === 'row' || 
                    scrollerState() === 'to-column'
                }>
                <div 
                    id="Goals-scroller" 
                    ref={scrollerRef}
                    onScrollEnd={scrollEnd}
                >
                    <span class="Goal-buffer"></span>
                    <For each={goals()}>
                        {(goal) => (
                            <SavingsGoal
                            objectID={goal.id}
                            name={goal.name}
                            target={goal.target}
                            balance={goal.balance}
                            />
                        )}
                    </For>
                    <AddButton ref={addGoalRef}
                        icon={addIcon} text={'Add goal'} 
                        onClick={() => setShowPopup('goal')}
                    />
                    <span class="Goal-buffer"></span>
                </div>
                </Show>
            </div>

            <Show when={showPopup() === 'transfer'}>
                <AnimatedArrows/>
            </Show>
            <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
            
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
    );
}