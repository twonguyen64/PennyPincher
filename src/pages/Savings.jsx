import { For, Show, createSignal, createEffect } from 'solid-js'
import { useMoney } from "../contexts/MoneyContext";
import { useMainWrapperContext } from '../contexts/MainWrapperContext'
import { getCenterElementOfScroller, getObjectFromElement, getObjectFromScroller } from '../utils/util-functions'

import SavingsGoal from "../components/Savings-page/SavingsGoal";
import PopupSavings from '../components/Savings-page/PopupSavings';
import addIcon from '../assets/add.svg'
import BackgroundBlur from '../components/BackgroundBlur';
import AddButton from '../components/AddButton';
import GoalInfo from '../components/Savings-page/GoalInfo';
import PaymentPlanSummary from '../components/Savings-page/PaymentPlanSummary';

export default function Savings() {
    const { showPopup, setShowPopup } = useMainWrapperContext();
    const { goals } = useMoney();
    const [currentGoal, setCurrentGoal] = createSignal(null);
    const [isGoalVisible, setIsGoalVisible] = createSignal(false)
    const [firstTimeRunning, setFirstTimeRunning] = createSignal(true)
    let scrollerRef, addGoalRef;

    createEffect(() => {
        if (firstTimeRunning()) {
            const goal = getObjectFromScroller(scrollerRef, goals())
            if (goal) {
                setIsGoalVisible(true)
                setFirstTimeRunning(false)
            }
        }
    });

    const updateCurrentGoal = (goal) => {
        setCurrentGoal(goal)
        setIsGoalVisible(true)
    }
    
    //Sets the current goal when the goal is edited or updated
    createEffect(() => {
        if (goals() && !firstTimeRunning()) {
            const goal = getObjectFromScroller(scrollerRef, goals())
            updateCurrentGoal(goal)
        }
    })

    /**
     * Sets the current goal when scrolling to a new goal.
     * Also prevents scrolling if the user scrolls to the 'Add goal button' in transfer mode
     */
    const scrollEnd = () => {
        if (goals().length < 1) return
        let middleElement = getCenterElementOfScroller(scrollerRef)
        
        //Case: middle element is the "Add goal" button
        if (middleElement === addGoalRef) {
            if (showPopup() === 'transfer') {
                //Prevent scrolling
                middleElement = addGoalRef.previousElementSibling
                middleElement.scrollIntoView({behavior: 'smooth',inline: 'center'});
            } 
            else setIsGoalVisible(false)
        }
        //Otherwise, middle element is a goal.
        else {
            const objectID = parseInt(middleElement.getAttribute('objectid'))
            if (objectID == currentGoal().id) return
            //Save current goal object to signal if scrolled to a new goal
            const goal = getObjectFromElement(middleElement, goals())
            updateCurrentGoal(goal)
        }
    };

    return (
        <div class='page-multi' id='Savingspage'>
        <div class='page-single' id='Savingspage-main' ontouchstart="">
            <BackgroundBlur/>
            <Show when={showPopup() === 'goal'}>
                <PopupSavings/>
            </Show>
            <div class='page-header'>Your savings goals</div>
            <div 
                id="Goals-scroller" 
                class="hidden-scrollbar" 
                ref={scrollerRef}
                onScrollEnd={scrollEnd}
            >
                <div class="Goal-buffer"></div>
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
                <div class="Goal-buffer"></div>
            </div>
            <div id='Goals-account-wrapper' class='main-wrapper'>
                <GoalInfo 
                currentGoal={currentGoal}
                isGoalVisible={isGoalVisible}
                />
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
            </div>
        </div>
        <div class='page-single'>
            <PaymentPlanSummary/>
        </div>
        </div>
    );
}

/**
 * 
<GoalInfo 
currentGoal={currentGoal}
isGoalVisible={isGoalVisible}
/>
 */