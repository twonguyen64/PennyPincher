import { For, Show, createSignal, createEffect } from 'solid-js'
import { useMainWrapperContext } from '../contexts/MainWrapperContext'
import { useMoney } from "../contexts/MoneyContext";
import { getCenterElementOfScroller, getObjectFromElement, getObjectFromScroller } from '../utils/util-functions'

import SavingsGoal from "../components/Savings-page/SavingsGoal";
import PopupSavings from '../components/Savings-page/PopupSavings';
import addIcon from '../assets/add.svg'
import BackgroundBlur from '../components/BackgroundBlur';
import AddButton from '../components/AddButton';
import GoalInfo from '../components/Savings-page/GoalInfo';

export default function Savings() {
    const { showPopup, setShowPopup, setEditMode } = useMainWrapperContext();
    const { goals } = useMoney();
    const [currentGoal, setCurrentGoal] = createSignal(null);
    const [isGoalVisible, setIsGoalVisible] = createSignal(false)
    const [firstTimeRun, setFirstTimeRun] = createSignal(true)
    let scrollerRef, addGoalRef;

    createEffect(() => {
        if (firstTimeRun()) {
            const goal = getObjectFromScroller(scrollerRef, goals())
            if (goal) {
                setIsGoalVisible(true)
                setCurrentGoal(goal)
                setFirstTimeRun(false)
            }
        }
    });

    const scrollEnd = () => {
        if (goals().length < 1) return
        let middleElement = getCenterElementOfScroller(scrollerRef)
        
        //Middle element is the "add goal" button
        if (middleElement === addGoalRef) {
            if (showPopup() === 'transfer') {
                //Prevent scrolling to "add goal" button when in contribute mode
                middleElement = addGoalRef.previousElementSibling
                middleElement.scrollIntoView({behavior: 'smooth',inline: 'center'});
            } 
            else setIsGoalVisible(false)
        }
        //Otherwise, middle element is a goal:
        else {
            setIsGoalVisible(true)
            const objectID = parseInt(middleElement.getAttribute('objectid'))
            if (objectID == currentGoal().id) return
            //Save current goal object to signal if scrolled to a new goal
            const goal = getObjectFromElement(middleElement, goals())
            setCurrentGoal(goal)
        }
    };

    return (
        <div class='page-single' ontouchstart="">
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
            </div>
        </div>
    );
}